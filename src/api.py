
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {"origins": "http://localhost:8080"}
})


@app.route("/api/health")
def health():
    return jsonify({
        "status": "healthy",
        "application": "XavierProject"
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
