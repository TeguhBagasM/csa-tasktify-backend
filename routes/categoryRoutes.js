const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

// GET /api/categories - Get all categories
router.get("/", categoryController.getAllCategories);

// GET /api/categories/:id - Get category by ID
router.get("/:id", categoryController.getCategoryById);

// GET /api/categories/user/:userId - Get categories by user ID
router.get("/user/:userId", categoryController.getCategoriesByUserId);

// POST /api/categories - Create new category
router.post("/", categoryController.createCategory);

// PUT /api/categories/:id - Update category
router.put("/:id", categoryController.updateCategory);

// DELETE /api/categories/:id - Delete category
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
