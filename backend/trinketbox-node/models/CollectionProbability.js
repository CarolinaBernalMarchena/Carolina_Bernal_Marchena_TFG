import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CollectionProbability = sequelize.define("CollectionProbability", {
  collection: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  normalProbability: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 95,
  },

  specialProbability: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 5,
  },
});

export default CollectionProbability;
