const http = require('http');

const PORT = process.env.PORT || 3000;
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json', ...corsHeaders });
    res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
    return;
  }

  let bodyData = '';
  req.on('data', chunk => { bodyData += chunk; });
  req.on('end', async () => {
    try {
      const { body, sys } = JSON.parse(bodyData);
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        res.writeHead(500, { 'Content-Type': 'application/json', ...corsHeaders });
        res.end(JSON.stringify({ error: 'GEMINI_API_KEY is missing on server.' }));
        return;
      }

      const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const response = await fetch(googleUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: body }] }],
          system_instruction: { parts: [{ text: sys }] },
          generation_config: { response_mime_type: "application/json" }
        })
      });

      const data = await response.json();
      res.writeHead(response.status, { 'Content-Type': 'application/json', ...corsHeaders });
      res.end(JSON.stringify(data));

    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json', ...corsHeaders });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
