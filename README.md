Below is a comprehensive, copy-ready GitHub README for your project, formatted specifically for a high-quality repository.

***

# Intelligent Cybersecurity Threat Detection System

An AI-driven cybersecurity platform designed to identify, analyze, and respond to security threats in real-time using advanced machine learning and behavioral analytics[cite: 634, 635].

## 📌 Project Overview
This system moves beyond traditional static rule-based security (like standard firewalls) by employing a hybrid AI model to detect both known and unknown "zero-day" attacks[cite: 696, 705, 718]. [cite_start]It continuously monitors network traffic, system logs, and user behavior to provide proactive security insights via an intuitive web dashboard[cite: 713, 719, 723].

## 🚀 Key Features
* [cite_start]**Hybrid AI Detection Engine**: Combines **DistilBERT** (NLP-based classification) for text analysis and **Isolation Forest** for statistical anomaly detection[cite: 751, 752, 764].
* [cite_start]**Real-Time Monitoring**: Continuous log streaming and system metric tracking (CPU, Memory, Disk, Network)[cite: 723, 767, 613].
* [cite_start]**Automated Response**: Instantly blocks malicious IP addresses and sends email notifications for high-severity threats[cite: 714, 753, 754].
* [cite_start]**Malware Integration**: Scans running processes for malicious signatures using the **VirusTotal API**[cite: 711].
* [cite_start]**Threat Intelligence**: Aggregates the latest cybersecurity news via RSS feeds to stay ahead of emerging global threats[cite: 755].
* [cite_start]**Robust Logging**: Automated system logging with local backup storage to ensure data integrity during database outages[cite: 712].

## 🛠 Tech Stack
* [cite_start]**Frontend**: Next.js (React) for a responsive, real-time security dashboard[cite: 749, 966].
* [cite_start]**Backend**: Flask (Python) API for processing threat detection logic and managing data flow[cite: 611, 874].
* [cite_start]**Database**: MongoDB for secure storage of credentials, system logs, and threat history[cite: 612, 964].
* **Machine Learning**:
    * [cite_start]`Scikit-learn` (Isolation Forest)[cite: 620].
    * [cite_start]`Hugging Face Transformers` (DistilBERT)[cite: 618].
* [cite_start]**Security**: JWT for authentication and Bcrypt for secure password hashing[cite: 616, 617].
* [cite_start]**Agent/Monitoring**: `psutil` for system metrics and `websocket-client` for real-time communication[cite: 613, 614].

## 🏗 System Architecture
The system is built on a 5-layer functional architecture:
1.  [cite_start]**Data Collection**: Captures raw network traffic (Scapy/Tshark) and system logs[cite: 587, 592].
2.  [cite_start]**Processing & Analysis**: Preprocesses data and extracts features for the AI models[cite: 588, 594].
3.  [cite_start]**AI Detection Engine**: Classifies activity as "Normal" or "Malicious" using trained ML models[cite: 589, 598].
4.  [cite_start]**Response & Mitigation**: Executes automated actions like IP blocking or alerting analysts[cite: 923, 924].
5.  [cite_start]**Visualization**: Displays real-time alerts and historical data on the Next.js dashboard[cite: 926, 927].

## 🚦 Getting Started

### Prerequisites
* Python 3.x
* Node.js & npm
* MongoDB Atlas or local instance

### Backend Setup
1.  Navigate to the `server/` directory.
2.  Install dependencies: `pip install -r requirements.txt`.
3.  Configure environment variables (MongoDB URI, JWT Secret, VirusTotal API Key).
4.  Run the server: `python server.py`.
5.  <img width="3070" height="1221" alt="Screenshot from 2026-04-01 15-54-11" src="https://github.com/user-attachments/assets/15f22d34-ca48-4663-888e-33ecbcfd7d80" />


### Agent Monitoring Setup
1.  [cite_start]Run `agent.py` on the machines you wish to monitor[cite: 613].
2.  [cite_start]The agent will gather metrics and send logs to the Flask API via WebSockets[cite: 614, 615].

### Frontend Setup
1.  Navigate to the `frontend/` directory.
2.  Install dependencies: `npm install`.
3.  Start the development server: `npm run dev`.
4.  <img width="3091" height="560" alt="Screenshot from 2026-04-01 15-54-22" src="https://github.com/user-attachments/assets/0f3e8bfb-2b99-4b5f-a1a3-ae433d2671a0" />

5.  <img width="3845" height="1958" alt="Screenshot from 2026-04-01 15-52-59" src="https://github.com/user-attachments/assets/b136d638-9aad-4afb-a213-36df39ad54af" />
<img width="3845" height="1958" alt="Screenshot from 2026-04-01 15-53-16" src="https://github.com/user-attachments/assets/25d50653-ddf8-424a-b996-91b8ee541ad0" />
<img width="3845" height="1958" alt="Screenshot from 2026-04-01 15-53-49" src="https://github.com/user-attachments/assets/bd521f06-3cb6-4a33-8787-b5cad5fc3dec" />




## 📜 Project Credits
* [cite_start]**Author**: Maxwell Gichinga Mwaura[cite: 628].
* [cite_start]**Supervisor**: Selina Atwani Ochukut[cite: 625].
* [cite_start]**Institution**: University of Nairobi, Department of Computer Science[cite: 621, 623].
* [cite_start]**Date**: January 2025[cite: 627].
