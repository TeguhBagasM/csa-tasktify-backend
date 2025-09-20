require("dotenv").config();
const { sequelize } = require("../models");

const safeSetupDatabase = async () => {
  try {
    console.log("🔄 Starting safe database setup...");

    // Test connection
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Check if we need to create tables by trying to query each one
    const models = ["User", "Category", "Task", "Subtask"];
    const { User, Category, Task, Subtask } = require("../models");

    console.log("\n🔍 Checking existing tables...");

    // Try to create tables one by one
    try {
      await User.sync();
      console.log("✅ Users table ready");
    } catch (error) {
      console.log("⚠️  Users table issue:", error.message);
    }

    try {
      await Category.sync();
      console.log("✅ Categories table ready");
    } catch (error) {
      console.log("⚠️  Categories table issue:", error.message);
    }

    try {
      await Task.sync();
      console.log("✅ Tasks table ready");
    } catch (error) {
      console.log("⚠️  Tasks table issue:", error.message);
    }

    try {
      await Subtask.sync();
      console.log("✅ Subtasks table ready");
    } catch (error) {
      console.log("⚠️  Subtasks table issue:", error.message);
    }

    console.log("\n🎉 Database setup completed!");

    // Test basic operations
    console.log("\n🧪 Testing database operations...");

    // Test count queries (should work even with empty tables)
    const userCount = await User.count();
    const categoryCount = await Category.count();
    const taskCount = await Task.count();
    const subtaskCount = await Subtask.count();

    console.log(`📊 Current record counts:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Tasks: ${taskCount}`);
    console.log(`   Subtasks: ${subtaskCount}`);

    console.log("\n✅ Database is ready for use!");

    // Close connection
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);

    // Specific error handling
    if (error.message.includes("permission denied")) {
      console.error("\n🔒 Permission Issue Detected:");
      console.error("Your database user has limited permissions.");
      console.error("This is common with hosted databases.");
      console.error("\n💡 Solutions:");
      console.error("1. Contact your database provider for CREATE TABLE permissions");
      console.error("2. Use database admin panel to create tables manually");
      console.error("3. Try connecting with a different user that has more permissions");
    } else if (error.message.includes("no schema has been selected")) {
      console.error("\n📂 Schema Issue Detected:");
      console.error("Database schema configuration issue.");
      console.error("\n💡 Solutions:");
      console.error('1. Ensure your database has a "public" schema');
      console.error("2. Check if your hosting provider uses a different default schema");
    }

    process.exit(1);
  }
};

safeSetupDatabase();
