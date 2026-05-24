import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Achievement = sequelize.define(
  "Achievement",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    achievementId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unlockedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId", "achievementId"],
      },
    ],
  },
);

export default Achievement;
