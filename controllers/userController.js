const { User, Category } = require("../models");

const userController = {
  // GET /api/users - Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Category,
            as: "categories",
          },
        ],
      });

      res.status(200).json({
        success: true,
        data: users,
        count: users.length,
      });
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve users",
        message: error.message,
      });
    }
  },

  // GET /api/users/:id - Get user by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Category,
            as: "categories",
          },
        ],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Get user by ID error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve user",
        message: error.message,
      });
    }
  },

  // POST /api/users - Create new user
  createUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await User.create({
        name,
        email,
        password,
      });

      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: userResponse,
      });
    } catch (error) {
      console.error("Create user error:", error);

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

      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          success: false,
          error: "Email already exists",
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to create user",
        message: error.message,
      });
    }
  },

  // PUT /api/users/:id - Update user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      await user.update({
        name: name || user.name,
        email: email || user.email,
        password: password || user.password,
      });

      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: userResponse,
      });
    } catch (error) {
      console.error("Update user error:", error);

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

      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          success: false,
          error: "Email already exists",
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to update user",
        message: error.message,
      });
    }
  },

  // DELETE /api/users/:id - Delete user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      await user.destroy();

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete user",
        message: error.message,
      });
    }
  },
};

module.exports = userController;
