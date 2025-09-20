const { Category, User, Task } = require("../models");

const categoryController = {
  // GET /api/categories - Get all categories
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
          {
            model: Task,
            as: "tasks",
          },
        ],
      });

      res.status(200).json({
        success: true,
        data: categories,
        count: categories.length,
      });
    } catch (error) {
      console.error("Get all categories error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve categories",
        message: error.message,
      });
    }
  },

  // GET /api/categories/:id - Get category by ID
  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
          {
            model: Task,
            as: "tasks",
          },
        ],
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          error: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      console.error("Get category by ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve category",
        message: error.message,
      });
    }
  },

  // GET /api/categories/user/:userId - Get categories by user ID
  getCategoriesByUserId: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const categories = await Category.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Task,
            as: "tasks",
          },
        ],
      });

      res.status(200).json({
        success: true,
        data: categories,
        count: categories.length,
      });
    } catch (error) {
      console.error("Get categories by user ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve user categories",
        message: error.message,
      });
    }
  },

  // POST /api/categories - Create new category
  createCategory: async (req, res) => {
    try {
      const { user_id, name } = req.body;

      // Verify user exists
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const category = await Category.create({
        user_id,
        name,
      });

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      console.error("Create category error:", error);

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
        error: "Failed to create category",
        message: error.message,
      });
    }
  },

  // PUT /api/categories/:id - Update category
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, user_id } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: "Category not found",
        });
      }

      // If user_id is being changed, verify new user exists
      if (user_id && user_id !== category.user_id) {
        const user = await User.findByPk(user_id);
        if (!user) {
          return res.status(404).json({
            success: false,
            error: "User not found",
          });
        }
      }

      await category.update({
        name: name || category.name,
        user_id: user_id || category.user_id,
      });

      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
      });
    } catch (error) {
      console.error("Update category error:", error);

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
        error: "Failed to update category",
        message: error.message,
      });
    }
  },

  // DELETE /api/categories/:id - Delete category
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: "Category not found",
        });
      }

      await category.destroy();

      res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete category",
        message: error.message,
      });
    }
  },
};

module.exports = categoryController;
