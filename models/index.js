const { Sequelize } = require("sequelize");
const config = require("../config/database");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

let sequelize;

if (env === "production" && process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      searchPath: "public",
    },
    define: {
      schema: "public",
    },
    logging: false,
    pool: dbConfig.pool,
  });
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: dbConfig.define,
    dialectOptions: dbConfig.dialectOptions,
    pool: dbConfig.pool,
  });
}

// Import models
const User = require("./User")(sequelize);
const Category = require("./Category")(sequelize);
const Task = require("./Task")(sequelize);
const Subtask = require("./Subtask")(sequelize);

// Define associations
User.hasMany(Category, {
  foreignKey: "user_id",
  as: "categories",
  onDelete: "CASCADE",
});

Category.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Category.hasMany(Task, {
  foreignKey: "category_id",
  as: "tasks",
  onDelete: "CASCADE",
});

Task.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

Task.hasMany(Subtask, {
  foreignKey: "task_id",
  as: "subtasks",
  onDelete: "CASCADE",
});

Subtask.belongsTo(Task, {
  foreignKey: "task_id",
  as: "task",
});

const db = {
  sequelize,
  Sequelize,
  User,
  Category,
  Task,
  Subtask,
};

module.exports = db;
