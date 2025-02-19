#!/usr/bin/env python3
import os
import random
import time
import json
import re
import requests
import psycopg2
from psycopg2 import sql

# ENV Variables or defaults (for Postgres)
DB_HOST = os.getenv("POSTGRES_HOST", "postgres")
DB_NAME = os.getenv("POSTGRES_DB", "baby_names")
DB_USER = os.getenv("POSTGRES_USER", "remix_user")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "supersecret")
API_KEY_1 = os.environ.get("API_KEY_1")

# Connect to Postgres
try:
    conn = psycopg2.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    cur = conn.cursor()
except Exception as e:
    print("Failed to connect to the database:", e)
    exit(1)

MODEL_ID = "llama-3.3-70b-versatile"

GENDERS = ["any", "male", "female"]
ORIGINS = [
    "Latin", "Greek", "Hebrew", "Norse", "Celtic", "Phoenician",
    "Albanian", "Basque", "Bulgarian", "Catalan", "Croatian", "Czech", "Danish", "Dutch", "English",
    "Finnish", "French", "Galician", "German", "Greek", "Hungarian", "Icelandic", "Irish", "Italian",
    "Latvian", "Lithuanian", "Macedonian", "Maltese", "Norwegian", "Polish", "Portuguese", "Romanian",
    "Russian", "Scottish", "Serbian", "Slovak", "Slovenian", "Spanish", "Swedish", "Welsh", "Arabic",
    "Aramaic", "Armenian", "Assyrian", "Azerbaijani", "Berber", "Coptic", "Egyptian (Ancient)", "Georgian",
    "Hebrew", "Kurdish", "Persian", "Turkish", "Bengali", "Gujarati", "Hindi", "Kannada", "Marathi", "Nepali",
    "Odia (Oriya)", "Punjabi", "Sanskrit", "Sinhala", "Tamil", "Telugu", "Urdu", "Chinese", "Japanese", "Korean",
    "Mongolian", "Filipino (Tagalog)", "Indonesian", "Javanese", "Khmer", "Lao", "Malay", "Burmese (Myanmar)",
    "Thai", "Vietnamese", "Afrikaans", "Amharic", "Akan", "Ewe", "Igbo", "Oromo", "Shona", "Somali", "Swahili",
    "Xhosa", "Yoruba", "Zulu", "Aboriginal Australian", "Fijian", "Hawaiian", "Maori", "Samoan", "Tongan",
    "Native American (general)", "Cherokee", "Navajo", "Lakota", "Quechua", "Aymara", "Guarani", "Mapuche",
]

def init_db():
    """
    Ensure the baby_names table exists.
    """
    cur.execute("""
    CREATE TABLE IF NOT EXISTS baby_names (
        name TEXT PRIMARY KEY,
        meaning TEXT,
        origin TEXT,
        famous_people TEXT,
        historic_figures TEXT,
        interesting_facts TEXT
    )
    """)
    conn.commit()

def store_name_in_db(result):
    """
    Insert a single name record into Postgres, ignoring duplicates.
    """
    name = result.get("name", "").strip()
    if not name:
        return

    meaning = result.get("meaning", "").strip()
    origin = result.get("origin", "").strip()
    famous = ", ".join(result.get("famous_people", []))
    historic = ", ".join(result.get("historic_figures", []))
    facts = result.get("interesting_facts", "").strip()

    try:
        cur.execute("""
            INSERT INTO baby_names(name, meaning, origin, famous_people, historic_figures, interesting_facts)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (name) DO NOTHING
        """, (name, meaning, origin, famous, historic, facts))
        conn.commit()
        print("Stored:", name)
    except Exception as e:
        print(f"Error storing {name}: {e}")
        conn.rollback()

def maybe_wait_for_limits(resp):
    """
    Parse rate limit headers to avoid surpassing usage limits.
    """
    headers = resp.headers
    remaining_req = headers.get("x-ratelimit-remaining-requests")
    remaining_tokens = headers.get("x-ratelimit-remaining-tokens")
    reset_tokens = headers.get("x-ratelimit-reset-tokens")

    if remaining_req is not None:
        try:
            r_req = int(float(remaining_req))
            if r_req < 10:
                print(f"Only {r_req} daily requests left! Sleeping 60s to slow down usage.")
                time.sleep(60)
        except ValueError:
            pass

    if remaining_tokens is not None and reset_tokens is not None:
        try:
            r_tokens = int(float(remaining_tokens))
            # Extract numeric portion from reset_tokens (may include decimals)
            numeric_part = "".join(ch for ch in reset_tokens if ch.isdigit() or ch == '.')
            seconds_to_reset = float(numeric_part) if numeric_part else 5.0
            if r_tokens < 100:
                wait_time = max(1, int(seconds_to_reset))
                print(f"Only {r_tokens} tokens left. Sleeping {wait_time}s to let tokens reset.")
                time.sleep(wait_time)
        except ValueError:
            pass

def extract_json_array(text):
    """
    Attempt to extract a JSON array from a given string using a regular expression.
    """
    match = re.search(r'\[.*\]', text, re.DOTALL)
    if match:
        return match.group(0)
    return None

def request_batch_of_names(num=10):
    """
    Request a batch of baby names from the API.
    Returns a list of baby name objects if successful, or None on error.
    """
    gender = random.choice(GENDERS)
    origin = random.choice(ORIGINS)

    system_instruction = (
        "You are an API that returns valid JSON with no markdown or extra text. "
        "When the user requests baby names, you MUST return an array of objects in JSON format."
    )

    # Updated prompt: More specific with clear instructions about meaning and origin.
    user_prompt = (
        f"Generate {num} unique baby names. For each name, provide a JSON object with the following fields:\n"
        "1. \"name\": The baby name.\n"
        "2. \"meaning\": The most widely accepted meaning of the name based on common historical and cultural usage. "
        "If the meaning is ambiguous or not widely recognized, leave this field empty.\n"
        "3. \"origin\": The primary cultural or linguistic origin of the name. Only include one generally accepted origin. "
        "If the origin is uncertain, leave this field empty.\n"
        "4. \"famous_people\": An array containing up to two well-known individuals with this name, if applicable.\n"
        "5. \"historic_figures\": An array containing up to two notable historical figures with this name, if applicable.\n"
        "6. \"interesting_facts\": A short statement with one or two interesting facts about the name, if any.\n\n"
        "Return only a JSON array formatted exactly as follows, with no extra text or markdown:\n"
        "[\n  {\n    \"name\": \"\",\n    \"meaning\": \"\",\n    \"origin\": \"\",\n    \"famous_people\": [\"\"],\n    \"historic_figures\": [\"\"],\n    \"interesting_facts\": \"\"\n  },\n  ...\n]\n"
    )

    payload = {
        "model": MODEL_ID,
        "messages": [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY_1}"
    }

    try:
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            json=payload,
            headers=headers,
            timeout=30
        )

        maybe_wait_for_limits(resp)

        if resp.status_code == 429:
            print("Got 429 (Too Many Requests). Sleeping 90s then retrying.")
            time.sleep(90)
            return None

        resp.raise_for_status()
        data = resp.json()

        if not data.get("choices"):
            print("No 'choices' in response:", data)
            return None

        raw_content = data["choices"][0]["message"]["content"]
        # Remove any markdown code fences if present
        raw_content = raw_content.replace("```json", "").replace("```", "").strip()

        json_array_str = extract_json_array(raw_content)
        if not json_array_str:
            print("Failed to extract JSON array from the response.")
            return None

        result = json.loads(json_array_str)
        if not isinstance(result, list):
            print("Expected a JSON array but got:", type(result))
            return None

        return result

    except requests.exceptions.RequestException as e:
        print("Network or HTTP error:", e)
        time.sleep(10)
        return None
    except (ValueError, json.JSONDecodeError) as je:
        print("Error parsing JSON:", je)
        time.sleep(10)
        return None

def main_loop():
    init_db()
    while True:
        batch = request_batch_of_names(num=10)
        if not batch:
            print("Got empty or invalid batch. Retrying after short sleep...")
            time.sleep(5)
            continue

        for item in batch:
            if not item.get("name"):
                continue
            store_name_in_db(item)

        # Sleep for a random delay between 5 and 10 minutes (300 to 600 seconds)
        delay = random.randint(300, 600)
        print(f"Sleeping for {delay} seconds before processing the next batch...")
        time.sleep(delay)

if __name__ == "__main__":
    try:
        main_loop()
    except KeyboardInterrupt:
        print("Stopping. Closing DB connection.")
    finally:
        cur.close()
        conn.close()
