import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Trade = sequelize.define(
  "Trade",
  {
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ownerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    offeredBoxId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requestedBoxId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    offeredBoxName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestedBoxName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    acceptedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    offeredBoxUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requestedBoxUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["ownerId", "offeredBoxId", "requestedBoxId"],
      },
    ],
  },
);

export default Trade;
