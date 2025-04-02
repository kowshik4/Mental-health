from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

# Set up Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
CORS(app,
     resources={r"/*": {"origins": "https://mental-health-1-n2v3.onrender.com"}},
     supports_credentials=True,
     methods=["GET", "POST", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

@app.route("/", methods=["GET"])
def home():
    return "Welcome to the Mental Health Advice API!"

@app.route("/get-advice", methods=["POST"])
def get_advice():
    try:
        user_input = request.json.get("user_input")
        if not user_input:
            return jsonify({"error": "user_input is required"}), 400

        prompt = f"""
        You are a mental health counselor assistant. Given the following issue a counselor is dealing with, provide thoughtful and empathetic advice on how to respond:

        Patient Issue: "{user_input}"

        Advice:
        """
        
        # Generate content using the Gemini API
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        # Extract the generated advice
        reply = response.text
        return jsonify({"advice": reply})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/favicon.ico")
def favicon():
    return "", 204

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)