import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Box = sequelize.define(
  "Box",
  {
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    collection: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    collectionUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hasSpecial: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    noForBuying: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["number", "collection"],
      },
    ],
  },
);

export default Box;
