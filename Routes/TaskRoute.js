const express = require("express");
const { auth } = require("../Middleware/authMiddleware");
const UserModel = require("../Model/UserModel");

const taskRoute = express.Router();

taskRoute.post("/create", auth, async (req, res) => {
  try {
    const { userId, title, description, isImportant, isCompleted } = req.body;
    const task = { title, description, isImportant, isCompleted };
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.tasks.push(task); // Assuming the tasks are stored in an array within the user model

    await user.save();

    res.status(201).json({ msg: "Task added", task, user }); // Sending back both task and user for reference
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all tasks
taskRoute.get("/", auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await UserModel.findById(userId).populate("tasks");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.tasks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

taskRoute.get("/:taskId", auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await UserModel.findById(userId).populate("tasks");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const task = user.tasks.find(
      (task) => task._id.toString() === req.params.taskId
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update a task
taskRoute.patch("/:taskId", auth, async (req, res) => {
  try {
    const { userId, title, description, isImportant, isCompleted } = req.body;
    const user = await UserModel.findById(userId).populate("tasks");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const task = user.tasks.find(
      (task) => task._id.toString() === req.params.taskId
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.title = title;
    task.description = description;
    task.isImportant = isImportant;
    task.isCompleted = isCompleted;

    await user.save();

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a task
taskRoute.delete("/:taskId", auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.tasks = user.tasks.filter(
      (task) => task._id.toString() !== req.params.taskId
    );
    await user.save();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = {
  taskRoute,
};
