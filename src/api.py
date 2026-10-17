from flask import Flask
from flask_cors import CORS
import os

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ["https://xavier-web-app.pages.dev"]
        }
    }
)


@app.route("/api/health")
def health():
    return {
        "application": "XavierProject",
        "status": "healthy"
    }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
