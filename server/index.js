const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/generate-ideas', async (req, res) => {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    try {
        const response = await axios.post(apiUrl, {
        contents: [
          {
            role: "user",
            parts: [
              { text: `Generate 5 unique and creative project ideas based on the following prompt: "${prompt}". Each idea should be concise, engaging, and suitable for a tech-savvy audience. Provide the ideas in a numbered list.` }
            ]
          }
        ],
        generationConfig: {
          response_mime_type: "application/json"
        }
      }
, {
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': `${apiKey}`
            }
        });
        res.json(JSON.parse(response.data.candidates[0].content.parts[0].text));
    } catch (error) {
        console.error('Error fetching from Gemini API:', error);
        res.status(500).json({ error: 'Error fetching from Gemini API' });
    }
});

app.post('/api/idea', async (req, res) => {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    try {
        const response = await axios.post(apiUrl, {
        contents: [
          {
            role: "user",
            parts: [
              { text: `Check this ${JSON.stringify(prompt)}. Now generate me steps to implement this project` }
            ]
          }
        ],
        generationConfig: {
          response_mime_type: "application/json",
          responseSchema: {
  type: "array",
  items: {
    type: "object",
    properties: {
      step_no: { type: "number" },
      step_title: { type: "string" },
      implementation_details: { type: "string" }
    },
    required: ["step_no", "step_title", "implementation_details"]
  }
}
        }
      }
, {
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': `${apiKey}`
            }
        });
        res.json(JSON.parse(response.data.candidates[0].content.parts[0].text));
        console.log("done");
    } catch (error) {
        console.error('Error fetching from Gemini API:', error);
        res.status(500).json({ error: 'Error fetching from Gemini API' });
    }
});

const User = require("./models/User");
app.use(express.json());

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    res.json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Error registering user", error: err });
  }
});

app.post("/api/projects/create", (req, res) => {
  const { username, title, description } = req.body;
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});