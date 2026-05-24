import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserBox = sequelize.define(
  "UserBox",
  {
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["UserId", "BoxId"],
      },
    ],
  },
);

export default UserBox;
