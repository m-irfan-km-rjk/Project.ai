const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv.config();
const app = express();
const joi = require('joi');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cors());
app.use((err, req, res, next) => {
  if (err.isJoi) {
    return res.status(400).json({
      status: "error",
      type: "validation_error",
      message: "Validation failed",
      details: err.details.map(d => d.message)
    });
  }

  if (err.name === "MongoError" || err.name === "MongooseError") {
    return res.status(500).json({
      status: "error",
      type: "database_error",
      message: err.message
    });
  }

  if (err.isAxiosError) {
    return res.status(err.response?.status || 500).json({
      status: "error",
      type: "api_error",
      message: err.message,
      details: err.response?.data || null
    });
  }

  res.status(err.status || 500).json({
    status: "error",
    type: "server_error",
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = joi.object({
  username: joi.string().alphanum().min(5).max(30).required(),
  password: joi.string().pattern(new RegExp('^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$')).required(),
  email: joi.string().email().required(),
  phone: joi.string().pattern(new RegExp('^[0-9]{10}$')).required()
});

function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) return next(error);
    req.body = value;
    next();
  };
}

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
            { text: `Generate 5 unique and creative project ideas based on the following prompt: "${prompt}". Each idea should be concise, engaging, and suitable for a tech-savvy audience. Provide the ideas in a numbered list. 4 Tags only.` }
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
      title: { type: "string" },
      description: { type: "string" },
      difficulty: { 
        type: "string",
        enum: ["Easy", "Medium", "Hard"]
      },
      stack: {
        type: "array",
        items: { type: "string" },
        maxItems: 4,
      },
      tags: {
        type: "array",
        items: { type: "string" },
        maxItems: 4,
      }
    },
    required: ["title", "description", "difficulty", "tags"]
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
  } catch (error) {
    console.error('Error fetching from Gemini API:', error);
    next(error);
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
    next(error);
  }
});

const User = require("./models/User");
const Project = require("./models/Projects");
app.use(express.json());

app.post("/api/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Compare plain password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    res.json({ success: true, message: "Login successful", userId: user._id });
  } catch (err) {
    console.error("Login error:", err);
    next(err); // pass to centralized error handler
  }
});

app.post("/api/register", validateBody(userSchema), async (req, res, next) => {
  try {
    const { username, password, email, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, email, phone });
    await newUser.save();

    res.json({ success: true, message: "User registered successfully", userId: newUser._id });
  } catch (err) {
    next(err);
  }
});

app.post("/api/projects/create", async (req, res, next) => {
  try {
    const { title, description, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        type: "not_found",
        message: "User not found"
      });
    }

    const newProject = new Project({ title, description });
    await newProject.save();

    user.projects.push(newProject._id);
    await user.save();

    res.json({
      status: "success",
      message: "Project created and added to user",
      project: newProject
    });

  } catch (err) {
    next(err);
  }
});

app.get("/api/user/projects", async (req, res, next) => {
  try {
    const userId = req.headers["userid"];
    const user = await User.findById(userId).populate('projects');
    if (!user) {
      return res.status(404).json({
        status: "error",
        type: "not_found",
        message: "User not found"
      });
    }
    res.json({
      status: "success",
      projects: user.projects
    });
  } catch (err) {
    next(err);
  }
});

app.get("/api/projects/:projectId", async (req, res, next) => {
  try {
    const { projectId } = req.params;       // projectId from URL params
    const userId = req.headers["userid"];   // userId from headers

    if (!userId) {
      return res.status(400).json({
        status: "error",
        type: "bad_request",
        message: "UserId header is required"
      });
    }

    // 1. Check if user exists
    const userCheck = await User.findById(userId);
    if (!userCheck) {
      return res.status(404).json({
        status: "error",
        type: "not_found",
        message: "User not found"
      });
    }

    // 2. Check if project belongs to user
    const hasAccess = userCheck.projects.some(
      (proj) => proj.toString() === projectId
    );

    if (!hasAccess) {
      return res.status(403).json({
        status: "error",
        type: "forbidden",
        message: "You do not have access to this project"
      });
    }

    // 3. Fetch project
    const project = await Project.findById(projectId).populate("steps");
    if (!project) {
      return res.status(404).json({
        status: "error",
        type: "not_found",
        message: "Project not found"
      });
    }

    res.json({
      status: "success",
      project
    });
  } catch (err) {
    next(err);
  }
});

app.post("/api/projects/:projectId/steps/add", async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { stepNumber, title, description, resources } = req.body;
    const Project = require("./models/Projects");
    const Step = require("./models/Steps");
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        status: "error",
        type: "not_found",
        message: "Project not found"
      });
    }
    const newStep = new Step({ stepNumber, title, description, resources });
    await newStep.save();
    project.steps.push(newStep._id);
    await project.save();

    res.json({
      status: "success",
      message: "Step added to project",
      step: newStep
    });
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});