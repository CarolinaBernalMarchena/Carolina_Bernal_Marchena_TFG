import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TokenHistory = sequelize.define("TokenHistory", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("gain", "spent"),
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  boxName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resultBoxName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default TokenHistory;
