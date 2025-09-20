const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Subtask = sequelize.define(
    "Subtask",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tasks",
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Subtask title cannot be empty",
          },
          len: {
            args: [1, 200],
            msg: "Subtask title must be between 1 and 200 characters",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "subtasks",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["task_id"],
        },
      ],
    }
  );

  return Subtask;
};
