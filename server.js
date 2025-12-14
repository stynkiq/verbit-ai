const express = require("express");
const bodyParser = require("body-parser");
// Make sure your OpenAI API key is set in environment variables (e.g., in a .env file)

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
// Serve static files from the 'public' directory (where your frontend/index.html should be)
app.use(express.static("public"));

// Chat endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  // 1. Check that the API key exists
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY is not set.");
    return res.status(500).json({ reply: "Server configuration error. API key is missing." });
  }

  if (!userMessage) {
    return res.status(400).json({ reply: "No message provided" });
  }

  try {
    // 2. Correct API URL: Use the Chat Completions endpoint
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        // 3. Correct Authorization
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      // 4. Correct body structure: Use 'messages'
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return res.status(response.status).json({ reply: `AI request failed: ${response.statusText}. Details: ${errText.substring(0, 100)}...` });
    }

    const data = await response.json();

    // 5. Correct response structure
    const reply = data.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ reply: "Server error. Please try again later." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
