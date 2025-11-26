from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

@app.route("/api/nft")
def nft():
    url = request.args.get("url")
    if not url:
        return jsonify({"error": "missing ?url="}), 400

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
        r = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(r.text, "html.parser")

        title_meta = soup.find("meta", property="og:title")
        description_meta = soup.find("meta", property="og:description")
        image_meta = soup.find("meta", property="og:image")

        # Separate name and id from title
        title_text = title_meta["content"] if title_meta else ""
        if "#" in title_text:
            name, nft_id = title_text.split("#", 1)
            name = name.strip()
            nft_id = nft_id.strip()
        else:
            name = title_text
            nft_id = None

        # Extract table info
        table_data = {}
        table = soup.find("table", class_="tgme_gift_table")
        if table:
            for row in table.find_all("tr"):
                cols = row.find_all(["th", "td"])
                if len(cols) == 2:
                    key = cols[0].get_text(strip=True)
                    val = cols[1].get_text(strip=True)
                    table_data[key] = val

        return jsonify({
            "id": nft_id,
            "name": name,
            "description": description_meta["content"] if description_meta else None,
            "image": image_meta["content"] if image_meta else None,
            "table": table_data,
            "url": url
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, threaded=True)
