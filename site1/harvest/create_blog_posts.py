#!/usr/bin/env python3
import os
import time
import json
import random
import requests
import psycopg2
import logging
from datetime import datetime, timedelta

# Configure logging for better visibility.
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

# ------------------------------------------------------------------------------
# Environment / Configuration
# ------------------------------------------------------------------------------

# Database credentials
DB_HOST = os.getenv("POSTGRES_HOST")
DB_NAME = os.getenv("POSTGRES_DB")
DB_USER = os.getenv("POSTGRES_USER")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")

# Groq model & API key
API_KEY_BLOG = os.getenv("API_KEY_BLOG")
MODEL_ID = os.getenv("MODEL_ID")

# Cloudflare text-to-image
CLOUDFLARE_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
CLOUDFLARE_API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
FLUX_MODEL = os.getenv("FLUX_MODEL")

# Blog creation config
POSTS_PER_DAY = int(os.getenv("POSTS_PER_DAY"))
INTERVAL_SECONDS = int(os.getenv("POST_CREATION_INTERVAL"))

# ------------------------------------------------------------------------------
# Database connection
# ------------------------------------------------------------------------------
conn = psycopg2.connect(
    host=DB_HOST,
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD
)
cur = conn.cursor()

def init_blog_db():
    """
    Ensure the blog_posts table exists with the recommended schema.
    """
    cur.execute("""
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content JSONB NOT NULL,
      meta_title TEXT,
      meta_description TEXT,
      excerpt TEXT,
      thumbnail_url TEXT,
      category TEXT,
      tags TEXT,
      published_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      author TEXT DEFAULT 'AI'
    );
    """)
    conn.commit()
    logger.info("Blog posts table ensured.")

# ------------------------------------------------------------------------------
# Topic & Category Lists
# ------------------------------------------------------------------------------
TOPIC_LIST = [
    "Exploring the Origins of Baby Names: Ancient Traditions and Modern Trends",
    "The Psychology of Names: How Your Name Influences Your Life",
    "Unconventional Naming Traditions from Around the World",
    "How Cultural Heritage Shapes Baby Naming Conventions",
    "Mythology and Baby Names: Stories Behind Legendary Names",
    "The Evolution of Baby Naming in the Digital Age",
    "Celebrity Baby Names: Trends and Cultural Impact",
    "Astrology and Names: Aligning Your Name with Your Zodiac Sign",
    "The Science Behind How Names Affect Success and Personality",
    "Historical Trends in Baby Names: Lessons from the Past",
    "The Impact of Global Migration on Baby Naming Trends",
    "Unique and Uncommon Names: How to Stand Out in a Crowd",
    "The Role of Social Media in Shaping Modern Baby Names",
    "Naming for Gender Fluidity: Embracing Non-Traditional Choices",
    "The Future of Baby Names: Predictions for the Next Decade",
    "How Literature and Pop Culture Influence Baby Naming Trends",
    "The Intersection of Technology and Naming: Digital Influences on Baby Names",
    "Names and Identity: How a Name Shapes Personal and Social Identity",
    "The Economic Impact of Baby Naming Trends in a Global Market",
    "Exploring Regional Variations: From Urban to Rural Naming Traditions",
    "The Art of Choosing a Name: Balancing Tradition and Innovation",
    "Cultural Appropriation vs. Appreciation in Baby Naming Practices",
    "How Historical Events Shape Baby Naming Trends: A Closer Look",
    "Beyond Baby Names: The Influence of a First Name on Career and Destiny",
    "The Role of Family Legacy in Modern Naming Conventions",
    "Modern Influences on Traditional Names: A Global Perspective",
    "How Music and Entertainment Shape Naming Trends",
    "The Influence of Fashion and Lifestyle on Baby Names",
    "Naming Trends in the Age of Globalization: A Comparative Study",
    "How Celebrity Culture Redefines Traditional Baby Names",
    "The Spiritual Significance of Names in Different Cultures",
    "Innovative Naming: When Parents Break All the Rules",
    "The Role of Religion in Shaping Naming Practices Across Continents",
    "Futuristic Baby Names: What Will the Next Generation Call Themselves?",
    "The Impact of Historical Figures on Modern Baby Name Choices",
    "Eco-friendly Baby Names: Embracing Nature and Sustainability",
    "Names Inspired by Literature: From Classic Novels to Modern Bestsellers",
    "The Influence of Sports Legends on Baby Naming Trends",
    "How Immigration and Diaspora Influence the Revival of Traditional Names",
    "Understanding the Social Dynamics of Naming: Trends and Statistics",
    "The Intersection of Politics and Baby Naming: When History Repeats Itself",
    "How Global Crises Impact Baby Naming Trends: A Study of Recent Events",
    "The Role of Government and Legislation in Regulating Baby Names",
    "Decoding the Meaning Behind Surnames: A Journey Through Family History",
    "Comparing Baby Name Trends Across Different Generations",
    "The Role of Language and Etymology in Shaping Baby Names",
    "The Connection Between Name Popularity and Economic Trends",
    "Names in the Digital Era: How Search Trends Influence Naming Choices",
    "From Tradition to Trend: The Transformation of Family Names Over Time",
    "Celebrity Baby Naming Controversies: What They Reveal About Society",
    "The Cultural Revival of Vintage and Retro Baby Names",
    "How Global Pop Culture Reboots Influence Baby Naming Trends",
    "Exploring the Intersection of Science Fiction and Baby Naming",
    "The Impact of Virtual Communities on Shaping New Naming Trends",
    "How Parental Psychology Influences the Choice of a Baby's Name",
    "The Evolution of Name Spellings: When Creativity Meets Tradition"
]

CATEGORIES = [
    "Origins & Culture",
    "Psychology",
    "Historical Trends",
    "Modern Trends",
    "Unconventional Topics"
]

# Define three style/tone pairs.
STYLE_TONE_PAIRS = [
    {"tone": "conversational", "style": "engaging and storytelling"},
    {"tone": "witty",         "style": "humorous and light-hearted"},
    {"tone": "formal",        "style": "academic and analytical"}
]

# ------------------------------------------------------------------------------
# Utility Functions
# ------------------------------------------------------------------------------
def generate_slug(title: str) -> str:
    """
    Create a simple URL-friendly slug from the title.
    """
    slug = title.lower().strip().replace(" ", "-")
    # Optionally, further clean up punctuation if needed
    return slug

def is_duplicate_slug(slug: str) -> bool:
    cur.execute("SELECT 1 FROM blog_posts WHERE slug = %s", (slug,))
    return cur.fetchone() is not None

def is_duplicate_title(title: str) -> bool:
    cur.execute("SELECT 1 FROM blog_posts WHERE title = %s", (title,))
    return cur.fetchone() is not None

# ------------------------------------------------------------------------------
# Cloudflare AI: Text-to-Image
# ------------------------------------------------------------------------------
def call_text_to_image_api(prompt: str, steps: int = 4) -> str:
    url = f"https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/ai/run/{FLUX_MODEL}"
    headers = {
        "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "prompt": prompt,
        "steps": steps
    }
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=60)
        resp.raise_for_status()

        data = resp.json()
        # The "image" is actually at data["result"]["image"], not data["image"]
        image_b64 = data.get("result", {}).get("image")

        if not image_b64:
            logger.error("No 'image' field in text-to-image response for prompt: %s. Full response: %s", prompt, data)
            return ""

        # Wrap it in data URI
        data_uri = f"data:image/jpeg;base64,{image_b64}"
        return data_uri

    except Exception as e:
        logger.error("Error calling flux-1-schnell for prompt '%s': %s", prompt, e)
        return ""


# ------------------------------------------------------------------------------
# Blog: Text Generation (Groq)
# ------------------------------------------------------------------------------
def call_blog_post_api(topic: str):
    """
    Call the Groq API to generate a complete blog post for a given topic.
    Then call text-to-image to generate a thumbnail.
    """
    # Pick a random style/tone
    selected_pair = random.choice(STYLE_TONE_PAIRS)
    tone = selected_pair["tone"]
    style = selected_pair["style"]

    system_instruction = (
        "You are an API that returns valid JSON with no markdown. "
        "Generate a complete, SEO-rich blog post on the given topic. "
        "Return a JSON object with the following keys: "
        "'title', 'slug', 'content', 'meta_title', 'meta_description', 'excerpt', "
        "'thumbnail_url', 'category', 'tags', 'published_at'. "
        "For 'content', return an object with keys like 'paragraph1', 'paragraph2', etc. "
        "For 'thumbnail_url', return an empty string. "
        "For 'published_at', return the current timestamp in ISO format. "
        "Do not include any extra text or explanation."
    )

    user_prompt = (
        f"Generate a blog post about the following topic as a suggestion. "
        f"The topic is only a guide; create a dynamic, unique title and content:\n"
        f"Topic: {topic}\n\n"
        f"Write this blog post in a {tone} tone and {style} style. Ensure the blog post is engaging, unique, and optimized for SEO. "
        "Include a compelling title (do not just echo the topic), a URL-friendly slug, SEO meta title, meta description, "
        "and a short excerpt summarizing the post. Also, include a category and relevant tags. "
        "The content should be well-structured with multiple paragraphs. "
        "Return a JSON object exactly as follows:\n"
        "{\n"
        '  "title": "...",\n'
        '  "slug": "...",\n'
        '  "content": { "paragraph1": "...", "paragraph2": "..." },\n'
        '  "meta_title": "...",\n'
        '  "meta_description": "...",\n'
        '  "excerpt": "...",\n'
        '  "thumbnail_url": "",\n'
        '  "category": "...",\n'
        '  "tags": "tag1, tag2, tag3",\n'
        '  "published_at": "2025-02-22T12:34:56Z"\n'
        "}\n"
        "Return only the JSON object."
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
        "Authorization": f"Bearer {API_KEY_BLOG}"
    }

    max_retries = 5
    attempt = 0
    backoff = 10  # initial delay in seconds

    while attempt < max_retries:
        try:
            resp = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                json=payload,
                headers=headers,
                timeout=60
            )
            resp.raise_for_status()
            data = resp.json()

            if not data.get("choices"):
                logger.error("No choices returned for topic: %s", topic)
                return None

            raw_content = data["choices"][0]["message"]["content"]
            # Remove any markdown fences
            raw_content = raw_content.replace("```json", "").replace("```", "").strip()

            result = json.loads(raw_content)
            if not isinstance(result, dict):
                logger.error("Expected JSON object for topic: %s", topic)
                return None

            # Now let's also generate an AI image from the same topic
            # or some variation to match the blog post's theme
            image_prompt = f"Cover image for baby names topic: {topic}"
            data_uri = call_text_to_image_api(image_prompt, steps=4)
            # Overwrite the placeholder empty string with our new image
            result["thumbnail_url"] = data_uri

            return result

        except requests.exceptions.HTTPError as e:
            if resp.status_code == 429:
                attempt += 1
                retry_after = resp.headers.get("Retry-After")
                delay = int(retry_after) if retry_after is not None else backoff
                logger.warning(
                    "Rate limited for topic '%s', attempt %d/%d. Retrying in %d seconds...",
                    topic, attempt, max_retries, delay
                )
                time.sleep(delay)
                backoff *= 2  # Exponential backoff
                continue
            else:
                logger.error("HTTP error for topic '%s': %s", topic, e)
                return None
        except Exception as e:
            logger.error("Error processing topic '%s': %s", topic, e)
            return None

    logger.error("Exceeded maximum retries for topic '%s'.", topic)
    return None

# ------------------------------------------------------------------------------
# Database Insert
# ------------------------------------------------------------------------------
def store_blog_post(blog_post):
    """
    Insert the generated blog post into the blog_posts table.
    """
    cur.execute("""
    INSERT INTO blog_posts (
      title, slug, content,
      meta_title, meta_description, excerpt,
      thumbnail_url, category, tags, published_at
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        blog_post.get("title"),
        blog_post.get("slug"),
        json.dumps(blog_post.get("content")),
        blog_post.get("meta_title"),
        blog_post.get("meta_description"),
        blog_post.get("excerpt"),
        blog_post.get("thumbnail_url"),
        blog_post.get("category"),
        blog_post.get("tags"),
        blog_post.get("published_at")
    ))
    conn.commit()
    logger.info("Stored blog post: %s", blog_post.get("title"))

# ------------------------------------------------------------------------------
# Main Loop
# ------------------------------------------------------------------------------
def main():
    init_blog_db()

    # Get the current day and initialize our daily counter.
    current_day = datetime.utcnow().date()
    posts_today = 0

    while True:
        # Reset if a new day has started
        now = datetime.utcnow()
        if now.date() != current_day:
            current_day = now.date()
            posts_today = 0
            logger.info("New day detected. Resetting daily post counter.")

        if posts_today < POSTS_PER_DAY:
            topic = random.choice(TOPIC_LIST)
            logger.info("Generating blog post for topic: %s", topic)

            blog_post = call_blog_post_api(topic)
            if blog_post:
                # Generate slug if not provided
                if not blog_post.get("slug") and blog_post.get("title"):
                    blog_post["slug"] = generate_slug(blog_post["title"])

                # Ensure slug is unique
                original_slug = blog_post["slug"]
                suffix = 1
                while is_duplicate_slug(blog_post["slug"]):
                    blog_post["slug"] = f"{original_slug}-{suffix}"
                    suffix += 1

                # Ensure title is unique
                original_title = blog_post["title"]
                suffix = 1
                while is_duplicate_title(blog_post["title"]):
                    blog_post["title"] = f"{original_title} ({suffix})"
                    suffix += 1

                # If published_at is missing, set it to now
                if not blog_post.get("published_at"):
                    blog_post["published_at"] = datetime.utcnow().isoformat() + "Z"

                # If category is missing, pick one
                if not blog_post.get("category"):
                    blog_post["category"] = random.choice(CATEGORIES)

                # Store the finished post
                store_blog_post(blog_post)
                posts_today += 1
                logger.info("Post #%d published for today.", posts_today)
            else:
                logger.warning("Skipping topic due to API error: %s", topic)
        else:
            logger.info(
                "Daily limit of %d posts reached. Waiting for the next day.",
                POSTS_PER_DAY
            )
            # Sleep until midnight UTC
            now = datetime.utcnow()
            tomorrow = datetime.combine(now.date() + timedelta(days=1), datetime.min.time())
            sleep_seconds = (tomorrow - now).total_seconds()
            time.sleep(sleep_seconds)
            continue

        # Sleep before generating the next post
        logger.info("Sleeping for %d seconds before next post...", INTERVAL_SECONDS)
        time.sleep(INTERVAL_SECONDS)

# ------------------------------------------------------------------------------
# Entry Point
# ------------------------------------------------------------------------------
if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logger.info("Interrupted. Exiting.")
    finally:
        cur.close()
        conn.close()
