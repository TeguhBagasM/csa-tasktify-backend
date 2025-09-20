const { Subtask, Task } = require("../models");

const subtaskController = {
  // GET /api/subtasks - Get all subtasks
  getAllSubtasks: async (req, res) => {
    try {
      const subtasks = await Subtask.findAll({
        include: [
          {
            model: Task,
            as: "task",
          },
        ],
      });

      res.status(200).json({
        success: true,
        data: subtasks,
        count: subtasks.length,
      });
    } catch (error) {
      console.error("Get all subtasks error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve subtasks",
        message: error.message,
      });
    }
  },

  // GET /api/subtasks/:id - Get subtask by ID
  getSubtaskById: async (req, res) => {
    try {
      const { id } = req.params;
      const subtask = await Subtask.findByPk(id, {
        include: [
          {
            model: Task,
            as: "task",
          },
        ],
      });

      if (!subtask) {
        return res.status(404).json({
          success: false,
          error: "Subtask not found",
        });
      }

      res.status(200).json({
        success: true,
        data: subtask,
      });
    } catch (error) {
      console.error("Get subtask by ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve subtask",
        message: error.message,
      });
    }
  },

  // GET /api/subtasks/task/:taskId - Get subtasks by task ID
  getSubtasksByTaskId: async (req, res) => {
    try {
      const { taskId } = req.params;

      const task = await Task.findByPk(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: "Task not found",
        });
      }

      const subtasks = await Subtask.findAll({
        where: { task_id: taskId },
      });

      res.status(200).json({
        success: true,
        data: subtasks,
        count: subtasks.length,
      });
    } catch (error) {
      console.error("Get subtasks by task ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve task subtasks",
        message: error.message,
      });
    }
  },

  // POST /api/subtasks - Create new subtask
  createSubtask: async (req, res) => {
    try {
      const { task_id, title, description, is_done } = req.body;

      // Verify task exists
      const task = await Task.findByPk(task_id);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: "Task not found",
        });
      }

      const subtask = await Subtask.create({
        task_id,
        title,
        description,
        is_done: is_done || false,
      });

      res.status(201).json({
        success: true,
        message: "Subtask created successfully",
        data: subtask,
      });
    } catch (error) {
      console.error("Create subtask error:", error);

      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to create subtask",
        message: error.message,
      });
    }
  },

  // PUT /api/subtasks/:id - Update subtask
  updateSubtask: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, is_done, task_id } = req.body;

      const subtask = await Subtask.findByPk(id);
      if (!subtask) {
        return res.status(404).json({
          success: false,
          error: "Subtask not found",
        });
      }

      // If task_id is being changed, verify new task exists
      if (task_id && task_id !== subtask.task_id) {
        const task = await Task.findByPk(task_id);
        if (!task) {
          return res.status(404).json({
            success: false,
            error: "Task not found",
          });
        }
      }

      await subtask.update({
        title: title || subtask.title,
        description: description !== undefined ? description : subtask.description,
        is_done: is_done !== undefined ? is_done : subtask.is_done,
        task_id: task_id || subtask.task_id,
      });

      res.status(200).json({
        success: true,
        message: "Subtask updated successfully",
        data: subtask,
      });
    } catch (error) {
      console.error("Update subtask error:", error);

      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to update subtask",
        message: error.message,
      });
    }
  },

  // PATCH /api/subtasks/:id/toggle - Toggle subtask completion status
  toggleSubtask: async (req, res) => {
    try {
      const { id } = req.params;

      const subtask = await Subtask.findByPk(id);
      if (!subtask) {
        return res.status(404).json({
          success: false,
          error: "Subtask not found",
        });
      }

      await subtask.update({
        is_done: !subtask.is_done,
      });

      res.status(200).json({
        success: true,
        message: `Subtask marked as ${subtask.is_done ? "completed" : "incomplete"}`,
        data: subtask,
      });
    } catch (error) {
      console.error("Toggle subtask error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to toggle subtask status",
        message: error.message,
      });
    }
  },

  // DELETE /api/subtasks/:id - Delete subtask
  deleteSubtask: async (req, res) => {
    try {
      const { id } = req.params;

      const subtask = await Subtask.findByPk(id);
      if (!subtask) {
        return res.status(404).json({
          success: false,
          error: "Subtask not found",
        });
      }

      await subtask.destroy();

      res.status(200).json({
        success: true,
        message: "Subtask deleted successfully",
      });
    } catch (error) {
      console.error("Delete subtask error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete subtask",
        message: error.message,
      });
    }
  },
};

module.exports = subtaskController;
