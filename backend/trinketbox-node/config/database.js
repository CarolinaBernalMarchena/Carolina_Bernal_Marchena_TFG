import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "trinketbox-database/database.sqlite",
});

export default sequelize;
