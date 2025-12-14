const express = require("express");
const bodyParser = require("body-parser");
// For Node <18, uncomment the next line and install node-fetch
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// Chat endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY is not set.");
    return res.status(500).json({ reply: "Server configuration error. API key is missing." });
  }

  if (!userMessage) {
    return res.status(400).json({ reply: "No message provided" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return res.status(response.status).json({ reply: `AI request failed: ${response.statusText}. Details: ${errText.substring(0, 100)}...` });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ reply: "Server error. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
