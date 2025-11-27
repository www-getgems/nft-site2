from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app, supports_credentials=True)

DB_PATH = "gifts.db"


def clean_name(name):
    if not name:
        return name

    # Remove trailing `#1234`
    if "#" in name:
        parts = name.rsplit("#", 1)
        # Ensure it's actually an ID
        if parts[1].strip().isdigit():
            return parts[0].strip()

    return name

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

def get_random_row():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("SELECT collection, gift_id, price FROM gifts ORDER BY RANDOM() LIMIT 1;")
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None


def parse_telegram_nft(collection, gift_id):
    url = f"https://t.me/nft/{collection}-{gift_id}"

    try:
        r = requests.get(url, timeout=10)
    except Exception as e:
        return {"error": f"Request failed: {e}"}

    if r.status_code != 200:
        return {"error": f"Tg returned status {r.status_code}"}

    soup = BeautifulSoup(r.text, "html.parser")

    # --- Parse NFT name ---
    name = None
    el = soup.find("meta", property="og:title")
    if el:
        name_raw = el.get("content")
        name = clean_name(name_raw)

    # --- Parse image ---
    image_url = None
    img_el = soup.find("meta", property="og:image")
    if img_el:
        image_url = img_el.get("content")

    # --- Parse attributes ---
    attributes = []
    props = soup.find_all("div")
    for div in props:
        txt = div.get_text(strip=True)
        if ":" in txt and len(txt) < 100:
            k, v = txt.split(":", 1)
            attributes.append({"trait_type": k.strip(), "value": v.strip()})

    return {
        "url": url,
        "name": name,
        "image": image_url,
        "attributes": attributes
    }


@app.route("/api/nft")
def api_nft():
    row = get_random_row()
    if not row:
        return jsonify({"error": "No rows"}), 404

    tg = parse_telegram_nft(row["collection"], row["gift_id"])

    # create flat JSON
    response = {
        "collection": row["collection"],
        "gift_id": row["gift_id"],
        "price": row["price"],
        "url": tg.get("url"),
        "name": tg.get("name"),
        "image": tg.get("image"),
        "attributes": tg.get("attributes", [])
    }

    return jsonify(response)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
