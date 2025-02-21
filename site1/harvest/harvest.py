#!/usr/bin/env python3
import os
import random
import time
import json
import requests
import psycopg2
import logging

# Configure logging to output to stdout with timestamps.
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s: %(message)s'
)
logger = logging.getLogger(__name__)

# ENV Variables or defaults (for Postgres)
DB_HOST = os.getenv("POSTGRES_HOST", "postgres")
DB_NAME = os.getenv("POSTGRES_DB", "baby_names")
DB_USER = os.getenv("POSTGRES_USER", "remix_user")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "supersecret")
API_KEY_1 = os.environ.get("API_KEY_1")

# Connect to Postgres
conn = psycopg2.connect(
    host=DB_HOST,
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD
)
cur = conn.cursor()

MODEL_ID = "llama-3.3-70b-versatile"

GENDERS = ["any", "male", "female"]
ORIGINS = [
    "Latin", "Greek", "Hebrew", "Norse", "Celtic", "Phoenician",
    # ... additional origins ...
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
    logger.info("Database initialized.")

def store_name_in_db(result):
    """
    Insert a single name record into Postgres, ignoring duplicates.
    """
    name = result.get("name", "").strip()
    meaning = result.get("meaning", "").strip()
    origin = result.get("origin", "").strip()
    famous = ", ".join(result.get("famous_people", []))
    historic = ", ".join(result.get("historic_figures", []))
    facts = result.get("interesting_facts", "").strip()

    cur.execute("""
        INSERT INTO baby_names(name, meaning, origin, famous_people, historic_figures, interesting_facts)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (name) DO NOTHING
    """, (name, meaning, origin, famous, historic, facts))
    conn.commit()
    logger.info("Stored: %s", name)

def maybe_wait_for_limits(resp):
    """
    Parse rate limit headers to avoid surpassing daily/tokens usage.
    If near limit, sleep longer to prevent spamming 429 errors.
    """
    headers = resp.headers
    remaining_req = headers.get("x-ratelimit-remaining-requests")
    remaining_tokens = headers.get("x-ratelimit-remaining-tokens")
    reset_tokens = headers.get("x-ratelimit-reset-tokens")

    if remaining_req is not None:
        r_req = int(float(remaining_req))
        if r_req < 10:
            logger.warning("Only %s daily requests left! Sleeping 60s.", r_req)
            time.sleep(60)

    if remaining_tokens is not None and reset_tokens is not None:
        r_tokens = int(float(remaining_tokens))
        numeric_part = "".join(ch for ch in reset_tokens if ch.isdigit() or ch == '.')
        try:
            seconds_to_reset = float(numeric_part)
        except ValueError:
            seconds_to_reset = 5.0

        if r_tokens < 100:
            wait_time = max(1, int(seconds_to_reset))
            logger.warning("Only %s tokens left. Sleeping %s seconds.", r_tokens, wait_time)
            time.sleep(wait_time)

def request_batch_of_names(num=10):
    """
    Request a batch of baby names from the API.
    """
    gender = random.choice(GENDERS)
    origin = random.choice(ORIGINS)

    system_instruction = (
        "You are an API that only returns valid JSON with no markdown. "
        "When the user requests baby names, you MUST return an array of objects in JSON. "
        "No extra text, no code fences."
    )

    user_prompt = (
        f"Generate {num} unique baby names for a {gender} child from {origin} origin. "
        "Return only a JSON array, like this:\n"
        "[\n  {\n    \"name\":\"\",\n    \"meaning\":\"\",\n    \"origin\":\"\",\n    \"famous_people\":[\"\"],\n    \"historic_figures\":[\"\"],\n    \"interesting_facts\":\"\"\n  },\n  ...\n]\n"
        "No extra text or explanation."
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
            logger.warning("Got 429 (Too Many Requests). Sleeping 90s then retry.")
            time.sleep(90)
            return None

        resp.raise_for_status()

        data = resp.json()

        if not data.get("choices"):
            logger.error("No 'choices' in response: %s", data)
            return None

        raw_content = data["choices"][0]["message"]["content"]
        raw_content = raw_content.replace("```json", "").replace("```", "").strip()

        first_bracket = raw_content.find("[")
        last_bracket = raw_content.rfind("]")
        raw_content = raw_content[first_bracket:last_bracket+1]

        result = json.loads(raw_content)
        if not isinstance(result, list):
            logger.error("Expected a JSON array, got something else.")
            return None
        return result

    except requests.exceptions.RequestException as e:
        logger.error("Network or HTTP error: %s", e)
        time.sleep(10)
        return None
    except (ValueError, json.JSONDecodeError) as je:
        logger.error("Error parsing JSON: %s", je)
        time.sleep(10)
        return None

def main_loop():
    init_db()
    while True:
        batch = request_batch_of_names(num=10)
        if not batch:
            logger.warning("Got empty or invalid batch. Retrying after short sleep...")
            time.sleep(5)
            continue

        for item in batch:
            if not item.get("name"):
                continue
            store_name_in_db(item)

        delay = random.randint(300, 600)
        logger.info("Sleeping for %s seconds before processing next batch...", delay)
        time.sleep(delay)

if __name__ == "__main__":
    try:
        main_loop()
    except KeyboardInterrupt:
        logger.info("Stopping. Closing DB.")
    finally:
        cur.close()
        conn.close()
