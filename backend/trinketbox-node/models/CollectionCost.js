import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const CollectionCost = sequelize.define("CollectionCost", {
  collection: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  tokenCost: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

export default CollectionCost;
