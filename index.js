require('dotenv').config();
const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log("Received message:", userMessage);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: userMessage }
      ]
    });

    console.log("OpenAI response received");
    res.json({
      reply: response.choices[0].message.content
    });
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    if (error.response) {
      console.error("OpenAI Response Data:", error.response.data);
    }
    res.status(500).json({
      error: "Failed to communicate with AI",
      details: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Chatbot running on port 3000");
});