const express = require("express");
const subtaskController = require("../controllers/subtaskController");

const router = express.Router();

// GET /api/subtasks - Get all subtasks
router.get("/", subtaskController.getAllSubtasks);

// GET /api/subtasks/:id - Get subtask by ID
router.get("/:id", subtaskController.getSubtaskById);

// GET /api/subtasks/task/:taskId - Get subtasks by task ID
router.get("/task/:taskId", subtaskController.getSubtasksByTaskId);

// POST /api/subtasks - Create new subtask
router.post("/", subtaskController.createSubtask);

// PUT /api/subtasks/:id - Update subtask
router.put("/:id", subtaskController.updateSubtask);

// PATCH /api/subtasks/:id/toggle - Toggle subtask completion status
router.patch("/:id/toggle", subtaskController.toggleSubtask);

// DELETE /api/subtasks/:id - Delete subtask
router.delete("/:id", subtaskController.deleteSubtask);

module.exports = router;
