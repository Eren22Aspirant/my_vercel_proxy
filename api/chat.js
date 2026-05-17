// api/chat.js
export default async function handler(req, res) {
    // 1. Handle CORS so your GitHub Pages site is allowed to talk to this backend
    res.setHeader('Access-Control-Allow-Origin', '*'); // You can change '*' to your actual GitHub Pages URL later for better security
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle the browser's preflight check
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const { body, sys } = req.body;
    const apiKey = process.env.GEMINI_API_KEY; // Securely pulled from Vercel's environment variables

    if (!apiKey) {
        return res.status(500).json({ error: 'Backend misconfiguration: GEMINI_API_KEY is missing.' });
    }

    try {
        // 2. Forward the payload to Google's Gemini API
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: body }] }],
                system_instruction: { parts: [{ text: sys }] },
                generation_config: { response_mime_type: "application/json" }
            })
        });

        const data = await response.json();
        return res.status(response.status).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
