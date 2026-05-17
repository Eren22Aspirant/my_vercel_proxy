# my_vercel_proxy
A secure, serverless Node.js backend proxy designed to abstract client-side API requests, handle CORS policies, and safely forward payloads to the Google Gemini API using protected server environment variables.


# My Vercel Proxy (Gemini Security Gatekeeper)

This repository serves as a secure, serverless backend intermediary between the frontend interface (hosted on GitHub Pages) and the Google Gemini API. 

## 🛡️ Purpose & Security Matrix
* **Credential Masking:** Prevents raw `AIzaSy` API keys from being exposed in frontend source files or client-side network traffic.
* **Corporate DLP Bypass:** Eliminates hardcoded strings to ensure automated data loss prevention scanners don't flag or quarantine repository source code.
* **Environment Variable Injection:** Key authentication is handled entirely server-side via Vercel's encrypted `process.env.GEMINI_API_KEY` pipeline.

## ⚙️ Architecture Structure
The proxy leverages Vercel's native file-system routing system:
└── api/
    └── chat.js  <-- Serverless Node.js execution handler
