require("dotenv").config();
const { sequelize } = require("../models");

const setupDatabase = async () => {
  try {
    console.log("🔄 Starting database setup...");

    // Test connection
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Drop all tables (if exists) and recreate them
    // WARNING: This will delete all data!
    await sequelize.sync({ force: true });
    console.log("✅ All tables created successfully!");

    console.log("\n📋 Tables created:");
    console.log("- users");
    console.log("- categories");
    console.log("- tasks");
    console.log("- subtasks");

    console.log("\n🎉 Database setup completed successfully!");

    // Close connection
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
};

setupDatabase();
