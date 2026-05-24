import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "trinketbox-database/database.sqlite",
});

//Sincronización
sequelize.sync();
//sequelize.sync({ force: true });

export default sequelize;
