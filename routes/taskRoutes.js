const express = require("express");
const taskController = require("../controllers/taskController");

const router = express.Router();

// GET /api/tasks - Get all tasks
router.get("/", taskController.getAllTasks);

// GET /api/tasks/:id - Get task by ID
router.get("/:id", taskController.getTaskById);

// GET /api/tasks/category/:categoryId - Get tasks by category ID
router.get("/category/:categoryId", taskController.getTasksByCategoryId);

// POST /api/tasks - Create new task
router.post("/", taskController.createTask);

// PUT /api/tasks/:id - Update task
router.put("/:id", taskController.updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete("/:id", taskController.deleteTask);

module.exports = router;
