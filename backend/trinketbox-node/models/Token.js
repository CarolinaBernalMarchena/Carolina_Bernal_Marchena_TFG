import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Token = sequelize.define(
  "Token",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numTokens: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastTokenDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId"],
      },
    ],
  },
);

export default Token;
