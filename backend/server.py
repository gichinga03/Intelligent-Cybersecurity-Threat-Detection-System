from flask import Flask, request, jsonify, render_template, send_file, Response
from flask_socketio import SocketIO, emit
import json
import datetime
import numpy as np
import psutil
import time
import os
from transformers import pipeline
from sklearn.ensemble import IsolationForest
import random
import smtplib
from flask_cors import CORS
from pymongo import MongoClient
import feedparser
from dotenv import load_dotenv
import requests
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import subprocess




load_dotenv()
app = Flask(__name__)
socketio = SocketIO(app)
CORS(app)  


# Connect to MongoDB Atlas
MONGO_URI = "your_mongo_atlas_connection_string"
uri = "mongodb+srv://gichinga03:Gichinga2003@cluster0.kialttn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri)
db = client["threat_detection_system"]
users_collection = db["users"]


LOG_FILE = "logs.json"
CSV_FILE = "logs_export.csv"
STATS_FILE = "stats.json"

# RSS feed URLs
RSS_FEED_URLS = [
    "https://thehackernews.com/feeds/posts/default",  # Example: The Hacker News
    "https://www.bleepingcomputer.com/feed/",  # Example: Bleeping Computer
    "https://www.securityweek.com/rss",  # Security Week
    # Add more RSS URLs here
]



# ✅ Load AI Models
print("[🚀] Initializing AI Models...")
threat_classifier = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")

# ✅ Train Isolation Forest for anomaly detection
print("[📊] Training Anomaly Detector...")
sample_logs = np.array([[100], [101], [102], [500], [503], [404], [403], [401]])
anomaly_detector = IsolationForest(n_estimators=100, contamination=0.05)
anomaly_detector.fit(sample_logs)
print("[✔] AI Models Ready!")

# ✅ Event Code Severity Mapping
EVENT_SEVERITY = {
    100: "Low", 101: "Low", 102: "Low",
    401: "Medium", 403: "Medium", 404: "Medium",
    500: "High", 503: "High"
}

THREAT_ACTIONS = {
    401: {"reason": "Unauthorized login attempt", "action": "Monitor login activity"},
    403: {"reason": "Access denied to a restricted resource", "action": "Check user permissions"},
    500: {"reason": "Critical system error", "action": "Investigate system logs"},
    503: {"reason": "Service unavailable", "action": "Restart the affected service"}
}

# Load JSON Data
def load_json(filename):
    if os.path.exists(filename):
        with open(filename, "r") as file:
            return json.load(file)
    return {}

# Save JSON Data
def save_json(filename, data):
    with open(filename, "w") as file:
        json.dump(data, file, indent=4)




#  Save logs to file
def save_logs(logs):
    with open(LOG_FILE, "w") as file:
        json.dump(logs, file, indent=4)

@app.route("/", methods=["GET"])
def get_logs():
    logs = load_logs()
    return jsonify(logs)  # ✅ Return logs as JSON


def classify_threat(event_code, message):
    prediction = threat_classifier(message)[0]
    ai_label = "THREAT" if prediction["label"] == "POSITIVE" else "SAFE"
    anomaly_detected = anomaly_detector.predict([[event_code]])[0] == -1
    severity = EVENT_SEVERITY.get(event_code, "Low")

    if ai_label == "THREAT" or anomaly_detected:
        severity = "High" if anomaly_detected else "Medium"

    if event_code in THREAT_ACTIONS:
        reason = THREAT_ACTIONS[event_code]["reason"]
        action = THREAT_ACTIONS[event_code]["action"]
    else:
        reason = f"Suspicious activity detected (Event Code {event_code})"
        action = "Review system logs and investigate unusual behavior"

        # Log unknown event codes for refinement
        if event_code not in THREAT_ACTIONS:
            print(f"[⚠] Unknown event code {event_code} detected. Consider adding it to THREAT_ACTIONS.")

    return severity, reason, action, prediction["score"]


def send_simple_message(log_entry):
    sender_email = "threatdetectai@gmail.com"
    sender_password = "ncisbzykghiaryzc"  # ⚠️ Use an App Password, NOT your Gmail password
    receiver_email = "gichinga03@gmail.com"

    subject = "🚨 High Severity Threat Detected!"
    body = (
        "A high severity threat has been detected on your system.\n\n"
        f"Event Code: {log_entry.get('event_code')}\n"
        f"Provider Name: {log_entry.get('provider_name')}\n"
        f"Computer Name: {log_entry.get('computer_name')}\n"
        f"Message: {log_entry.get('message')}\n"
        f"Severity: {log_entry.get('severity')}\n"
        f"Reason: {log_entry.get('reason')}\n"
        f"Suggested Action: {log_entry.get('suggested_action')}\n"
        f"AI Confidence: {log_entry.get('ai_confidence')}\n"
        f"Timestamp: {log_entry.get('timestamp')}\n\n"
        "Please check the threat detection dashboard immediately."
    )

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, receiver_email, msg.as_string())
        print("[📧] Alert email sent successfully!")
    except Exception as e:
        print(f"[⚠️] Failed to send alert email: {e}")



@app.route("/add_log", methods=["POST"])
def add_log():
    logs = load_json(LOG_FILE)
    data = request.json
    severity, reason, action, confidence = classify_threat(int(data["event_code"]), data["message"])

    log_entry = {
        "event_code": data["event_code"],
        "provider_name": data.get("provider_name", "Unknown"),
        "computer_name": data.get("computer_name", "Unknown"),
        "message": data["message"],
        "severity": severity,
        "reason": reason,
        "suggested_action": action,
        "ai_confidence": confidence,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

    logs.append(log_entry)
    save_json(LOG_FILE, logs)
    socketio.emit("new_log", log_entry)
    
    if severity == "High":
        socketio.emit("alert", {"message": f"🚨 {reason} - {action}"})
        try:
            send_simple_message(log_entry)
            print("[📧] Alert email sent successfully!")
        except Exception as e:
            print(f"[⚠️] Failed to send alert email: {e}")

    return jsonify({"message": "Log stored", "severity": severity}), 201



# Add after the existing imports
BLOCKED_IPS_FILE = "blocked_ips.json"

def save_blocked_ip(ip_data):
    blocked_ips = load_json(BLOCKED_IPS_FILE)
    # Ensure blocked_ips is a list
    if not isinstance(blocked_ips, list):
        blocked_ips = []
    
    blocked_ips.append({
        **ip_data,
        "timestamp": datetime.datetime.utcnow().isoformat()
    })
    save_json(BLOCKED_IPS_FILE, blocked_ips)

def send_block_notification(ip_data):
    sender_email = "threatdetectai@gmail.com"
    sender_password = "ncisbzykghiaryzc"
    receiver_email = "gichinga03@gmail.com"

    subject = "🚫 IP Address Blocked"
    body = (
        f"An IP address has been blocked:\n\n"
        f"IP Address: {ip_data.get('ip_address')}\n"
        f"Process Name: {ip_data.get('process_name')}\n"
        f"Reason: {ip_data.get('reason', 'Suspicious activity detected')}\n"
        f"Timestamp: {ip_data.get('timestamp')}\n\n"
        "This action was taken automatically by the threat detection system."
    )

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, receiver_email, msg.as_string())
        print("[📧] Block notification email sent successfully!")
    except Exception as e:
        print(f"[⚠️] Failed to send block notification email: {e}")


@app.route("/block_threat", methods=["POST"])
def block_threat():
    data = request.json
    block_data = {
        "ip_address": data.get("ip_address"),
        "process_name": data.get("process_name"),
        "reason": data.get("reason", "Suspicious activity detected")
    }
    
    # Save blocked IP
    save_blocked_ip(block_data)
    
    # Send notification
    send_block_notification(block_data)
    
    # Emit socket event
    socketio.emit("block_request", block_data)
    return jsonify({"message": "Blocking request sent to agent"}), 200

# Add new endpoint to get blocked IPs
@app.route("/api/blocked-ips", methods=["GET"])
def get_blocked_ips():
    try:
        blocked_ips = load_json(BLOCKED_IPS_FILE)
        # Ensure we always return an array
        if not isinstance(blocked_ips, list):
            blocked_ips = []
        return jsonify(blocked_ips)
    except Exception as e:
        # Return empty array if there's an error
        return jsonify([])



# ✅ Performance Metrics
@app.route("/performance_metrics")
def performance_metrics():
    start_time = time.time()
    prediction = threat_classifier("Test message")[0]
    processing_time = time.time() - start_time
    anomaly_count = sum(1 for log in load_json(LOG_FILE) if log["severity"] == "High")

    return jsonify({
        "AI Model Confidence": f"{prediction['score']:.2%}",
        "Processing Speed": f"{processing_time:.4f} seconds",
        "CPU Usage": f"{psutil.cpu_percent()}%",
        "Memory Usage": f"{psutil.virtual_memory().percent}%",
        "Detected Anomalies": anomaly_count
    })




# Function to load logs
def load_logs():
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as file:
            return json.load(file)
    return []



@app.route("/send_stats", methods=["POST"])
def receive_stats():
    data = request.json  # Expecting JSON data
    print(f"Received System Stats: {data}")
    return jsonify({"status": "success"}), 200




@app.route("/api/rss", methods=["GET"])
def fetch_rss():
    rss_data = []

    try:
        for url in RSS_FEED_URLS:
            feed = feedparser.parse(url)
            articles = []

            for entry in feed.entries:
                articles.append({
                    "title": entry.title,
                    "link": entry.link,
                    "pubDate": entry.published,
                    "description": entry.summary,
                })

            rss_data.append({
                "source": url,
                "articles": articles
            })
        
        return jsonify(rss_data), 200

    except Exception as e:
        return jsonify({"message": "Failed to fetch RSS feeds", "error": str(e)}), 500



# Route to check if the server is online
@app.route('/')
def home():
    return jsonify({"status": "Server is online"}), 200


@app.route('/train_ai_stream')
def train_ai_stream():
    def generate():
        process = subprocess.Popen(
            ["python", "../trainingAI/train/sent.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            bufsize=1,
            universal_newlines=True
        )
        for line in iter(process.stdout.readline, ''):
            yield f"data: {line}\n\n"
        process.stdout.close()
        process.wait()
    return Response(generate(), mimetype='text/event-stream')


# New endpoint to fetch all users
@app.route("/api/users", methods=["GET"])
def get_users():
    try:
        users = list(users_collection.find({}, {"_id": 0, "password": 0}))
        return jsonify(users)
    except Exception as e:
        return jsonify({"error": "Failed to fetch users"}), 500


# New endpoint to delete a user by email
@app.route("/api/users/<email>", methods=["DELETE"])
def delete_user(email):
    try:
        result = users_collection.delete_one({"email": email})
        if result.deleted_count == 0:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"message": "User deleted"})
    except Exception as e:
        return jsonify({"error": "Failed to delete user"}), 500


if __name__ == "__main__":
    print("[🌐] Server Running at http://127.0.0.1:5000")
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
