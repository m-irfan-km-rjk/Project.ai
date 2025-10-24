const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv.config();
const app = express();
const joi = require('joi');
const bcrypt = require('bcrypt');
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = joi.object({
  username: joi.string().alphanum().min(5).max(30).required(),
  password: joi.string().pattern(new RegExp(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/)).required(),
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
    required: ["title", "description", "difficulty", "tags", "stack"]
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
  }
});

app.post('/api/idea', async (req, res, next) => {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  try {
    const response = await axios.post(apiUrl, {
      contents: [
        {
          role: "user",
          parts: [
            { text: `You are an expert project mentor. Here is a project idea: ${JSON.stringify(prompt)}. 

Generate a comprehensive step-by-step implementation plan for this project. Each step should include: 
1. A concise step title.
2. A detailed description explaining how to implement it.
3. Suggested learning resources, tutorials, or documentation links if necessary.

Organize the steps sequentially, ensuring clarity for someone who wants to implement the project from scratch. Make it actionable and beginner-friendly, but technically accurate.
` }
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
              step_number: { type: "number" },
              step_title: { type: "string" },
              implementation_details: { type: "string" },
              completed: { type: "boolean", default: false }  // <-- added
            },
            required: ["step_number", "step_title", "implementation_details"]
          }
        }
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      }
    });

    // Parse and send the steps back
    const generatedSteps = JSON.parse(response.data.candidates[0].content.parts[0].text);

    // Ensure `completed` exists on each step (default false)
    const formattedSteps = generatedSteps.map(step => ({
      ...step,
      completed: step.completed ?? false
    }));

    res.json(formattedSteps);
    console.log("Steps generated successfully");
  } catch (error) {
    console.error('Error fetching from Gemini API:', error);
    next(error);
  }
});

const User = require("./models/User");
const Project = require("./models/Projects");

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
    const { title, description, userId, difficulty, tags, stack } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        type: "not_found",
        message: "User not found"
      });
    }

    const newProject = new Project({ title, description, difficulty, tags, stack });
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

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "project_images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// Upload images & attach to a project
app.post(
  "/api/projects/:projectId/upload-images",
  upload.array("images", 5), // multer still limits per request
  async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({
          status: "error",
          type: "not_found",
          message: "Project not found",
        });
      }

      const existingImagesCount = project.images.length;
      const newImagesCount = req.files.length;

      // Prevent exceeding 5 images total
      if (existingImagesCount + newImagesCount > 5) {
        return res.status(400).json({
          status: "error",
          type: "limit_exceeded",
          message: `You can upload a maximum of 5 images per project. You already have ${existingImagesCount} image(s).`,
        });
      }

      // Get uploaded image URLs from Cloudinary
      const imageUrls = req.files.map((file) => file.path);

      // Add them to the project
      project.images.push(...imageUrls);
      await project.save();

      res.json({
        status: "success",
        message: `${imageUrls.length} images uploaded and added to project`,
        images: imageUrls,
      });
    } catch (err) {
      next(err);
    }
  }
);

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
    const project = await Project.findById(projectId);
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
    const stepsArray = req.body; // Expecting an array of steps

    if (!Array.isArray(stepsArray)) {
      return res.status(400).json({
        status: "error",
        type: "invalid_input",
        message: "Expected an array of steps"
      });
    }

    const Project = require("./models/Projects");

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        status: "error",
        type: "not_found",
        message: "Project not found"
      });
    }

    // Map incoming steps to the structure inside Project.steps
    const newSteps = stepsArray.map(step => ({
      step_number: step.step_number,
      step_title: step.step_title,
      implementation_details: step.implementation_details,
      completed: false,
      resources: step.resources || []
    }));

    // Add steps to project
    project.steps.push(...newSteps);
    await project.save();

    res.json({
      status: "success",
      message: `${newSteps.length} steps added to project`,
      steps: newSteps
    });
  } catch (err) {
    next(err);
  }
});

app.get("/api/users/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        type: "not_found",
        message: "User not found"
      });
    }
    res.json({
      name: user.username,
      email: user.email,
      projectCount: user.projects.length,
      profilePic: user.profilePic || ""
    });
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.put("/api/projects/:projectId/steps/update", async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const { steps, progress } = req.body;

        const Project = require("./models/Projects");
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ status: "error", message: "Project not found" });
        }

        project.steps = steps;
        project.progress = progress;
        if(progress === 100) {
            project.status = "Completed";
        } else if (progress > 0) {
            project.status = "In Progress";
        } else {
            project.status = "Pending";
        }

        await project.save();

        res.json({
            status: "success",
            message: "Project steps and progress updated",
            steps: project.steps,
            progress: project.progress
        });
    } catch (err) {
        next(err);
    }
});


//Change password route
app.put("/api/users/:userId/change-password", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        type: "not_found",
        message: "User not found"
      });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        type: "unauthorized",
        message: "Old password is incorrect"
      });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    res.json({
      status: "success",
      message: "Password changed successfully"
    });
  } catch (err) {
    next(err);
  }
});