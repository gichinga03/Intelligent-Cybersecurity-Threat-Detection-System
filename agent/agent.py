import requests
import win32evtlog
import json
import time
import socket
import psutil
import webbrowser
import os
from threading import Thread
from flask import Flask
from flask_socketio import SocketIO
import datetime

SERVER_URL = "http://127.0.0.1:5000"
LOG_URL = f"{SERVER_URL}/add_log"
STATS_URL = f"{SERVER_URL}/send_stats"
BLOCK_URL = f"{SERVER_URL}/block_threat"





COMPUTER_NAME = os.getenv("COMPUTERNAME")  # Get system name

# Initialize Flask app and SocketIO
app = Flask(__name__)
socketio = SocketIO(app)




LOG_FILE = "offline_logs.json"

def is_server_online():
    try:
        response = requests.get(SERVER_URL, timeout=3)
        print(f"Server response: {response.status_code}")
        if response.status_code == 200:
            return True
        else:
            print(f"Received non-200 status code: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"Request failed with exception: {e}")
        return False


def save_logs_locally(logs):
    """Save logs to a local file if the server is offline."""
    if not logs:
        return
    
    # Read existing logs if file exists
    stored_logs = []
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, "r") as f:
                stored_logs = json.load(f)
        except json.JSONDecodeError:
            stored_logs = []
    
    stored_logs.extend(logs)

    # Save updated logs
    with open(LOG_FILE, "w") as f:
        json.dump(stored_logs, f, indent=4)

    print(f"[💾] Saved {len(logs)} logs locally.")


def send_stored_logs():
    """Send locally stored logs when the server is back online."""
    if not os.path.exists(LOG_FILE):
        return

    try:
        with open(LOG_FILE, "r") as f:
            stored_logs = json.load(f)

        if not stored_logs:
            return

        for log in stored_logs:
            try:
                response = requests.post(LOG_URL, json=log, timeout=5)
                if response.status_code == 200:
                    print(f"[✔] Sent stored log: {log}")
                else:
                    print(f"Failed to send stored log: {response.status_code}")
                    return  # Stop if sending fails
            except requests.exceptions.RequestException as e:
                print(f"[❌] Error sending stored log: {e}")
                return  # Stop if network error occurs

        # If all logs are sent, delete the local storage file
        os.remove(LOG_FILE)
        print("[🗑] All stored logs sent and deleted locally.")

    except json.JSONDecodeError:
        print("[⚠] Corrupted log file, deleting it.")
        os.remove(LOG_FILE)








def get_windows_logs(log_type="Security", num_events=5):
    logs = []
    try:
        hand = win32evtlog.OpenEventLog(None, log_type)
        events = win32evtlog.ReadEventLog(hand, win32evtlog.EVENTLOG_BACKWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ, 0, num_events)

        for event in events:
            timestamp = datetime.datetime.now().strftime("%d-%m-%Y %H:%M")
            logs.append({
                "timestamp": timestamp,
                "event_code": event.EventID,
                "provider_name": event.SourceName,
                "computer_name": COMPUTER_NAME,
                "message": event.StringInserts if event.StringInserts else "No message"
            })
    except Exception as e:
        print(f"[ERROR] Failed to read logs: {e}")
    return logs


def send_logs():
    """Send logs to server or store them locally if offline."""
    logs = get_windows_logs()

    if is_server_online():
        send_stored_logs()  # Try sending stored logs first

        for log in logs:
            try:
                response = requests.post(LOG_URL, json=log, timeout=5)
                print(f"[✔] Sent Log: {log} | Response: {response.status_code}")
            except requests.exceptions.RequestException as e:
                print(f"[❌] Error Sending Log: {e}")
                save_logs_locally(logs)
                return  # Stop if network error occurs
    else:
        print("[⚠] Server offline, storing logs locally.")
        save_logs_locally(logs)


# ✅ Handle Blocking Requests
@socketio.on("block_request")
def on_block_request(data):
    ip = data.get("ip_address")
    process = data.get("process_name")

    if ip:
        os.system(f"netsh advfirewall firewall add rule name='Block {ip}' dir=in action=block remoteip={ip}")
    if process:
        os.system(f"taskkill /F /IM {process}")

# Send system stats
def send_stats():
    timestamp = datetime.datetime.now().strftime("%d-%m-%Y %H:%M")
    stats = {
        "timestamp": timestamp,
        "computer_name": COMPUTER_NAME,
        "cpu_usage": psutil.cpu_percent(),
        "memory_usage": psutil.virtual_memory().percent
    }
    try:
        response = requests.post(STATS_URL, json=stats, timeout=5)
        print(f"[📊] Sent System Stats: {stats} | Response: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"[❌] Error Sending Stats: {e}")


def run_server():
    socketio.run(app, host="127.0.0.1", port=5000)


# ✅ Main Loop running in a separate thread
def main_loop():
    was_offline = False  # Track previous server status
    
    while True:
        if is_server_online():
            if was_offline:
                print("[🔄] Server is back online, attempting to send stored logs.")
                send_stored_logs()  # Try sending stored logs
                was_offline = False  # Reset status
        else:
            was_offline = True  # Mark server as offline
            
        send_logs()
        send_stats()
        time.sleep(10 if psutil.cpu_percent() < 50 else 20)

# Start the Flask server and main loop in separate threads
if __name__ == "__main__":
    server_thread = Thread(target=run_server)
    server_thread.daemon = True
    server_thread.start()

    main_thread = Thread(target=main_loop)
    main_thread.daemon = True
    main_thread.start()

    # Keep the main thread running
    while True:
        time.sleep(1)
