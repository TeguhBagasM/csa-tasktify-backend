const { Task, Category, Subtask } = require("../models");

const taskController = {
  // GET /api/tasks - Get all tasks
  getAllTasks: async (req, res) => {
    try {
      const tasks = await Task.findAll({
        include: [
          {
            model: Category,
            as: "category",
          },
          {
            model: Subtask,
            as: "subtasks",
          },
        ],
      });

      res.status(200).json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      console.error("Get all tasks error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve tasks",
        message: error.message,
      });
    }
  },

  // GET /api/tasks/:id - Get task by ID
  getTaskById: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id, {
        include: [
          {
            model: Category,
            as: "category",
          },
          {
            model: Subtask,
            as: "subtasks",
          },
        ],
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          error: "Task not found",
        });
      }

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      console.error("Get task by ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve task",
        message: error.message,
      });
    }
  },

  // GET /api/tasks/category/:categoryId - Get tasks by category ID
  getTasksByCategoryId: async (req, res) => {
    try {
      const { categoryId } = req.params;

      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: "Category not found",
        });
      }

      const tasks = await Task.findAll({
        where: { category_id: categoryId },
        include: [
          {
            model: Subtask,
            as: "subtasks",
          },
        ],
      });

      res.status(200).json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      console.error("Get tasks by category ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve category tasks",
        message: error.message,
      });
    }
  },

  // POST /api/tasks - Create new task
  createTask: async (req, res) => {
    try {
      const { category_id, title, description } = req.body;

      // Verify category exists
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: "Category not found",
        });
      }

      const task = await Task.create({
        category_id,
        title,
        description,
      });

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task,
      });
    } catch (error) {
      console.error("Create task error:", error);

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
        error: "Failed to create task",
        message: error.message,
      });
    }
  },

  // PUT /api/tasks/:id - Update task
  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, category_id } = req.body;

      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: "Task not found",
        });
      }

      // If category_id is being changed, verify new category exists
      if (category_id && category_id !== task.category_id) {
        const category = await Category.findByPk(category_id);
        if (!category) {
          return res.status(404).json({
            success: false,
            error: "Category not found",
          });
        }
      }

      await task.update({
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        category_id: category_id || task.category_id,
      });

      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task,
      });
    } catch (error) {
      console.error("Update task error:", error);

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
        error: "Failed to update task",
        message: error.message,
      });
    }
  },

  // DELETE /api/tasks/:id - Delete task
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;

      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: "Task not found",
        });
      }

      await task.destroy();

      res.status(200).json({
        success: true,
        message: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Delete task error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete task",
        message: error.message,
      });
    }
  },
};

module.exports = taskController;
