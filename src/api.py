from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {
        "origins": ["https://xavier-web-app.pages.dev"]
    }
})

# Your existing routes go below
@app.route("/api/health")
def health():
    return {
        "application": "XavierProject",
        "status": "healthy"
    }