import User from "./User.js";
import Box from "./Box.js";
import UserBox from "./UserBox.js";
import Trade from "./Trade.js";
import Achievement from "./Achievement.js";
import Token from "./Token.js";
import TokenHistory from "./TokenHistory.js";
import CollectionProbability from "./CollectionProbability.js";
import CollectionCost from "./CollectionCost.js";

//Relaciones
User.belongsToMany(Box, { through: UserBox });
Box.belongsToMany(User, { through: UserBox });

UserBox.belongsTo(User);
UserBox.belongsTo(Box);

Trade.belongsTo(Box, { foreignKey: "offeredBoxId", as: "offeredBox" });
Trade.belongsTo(Box, { foreignKey: "requestedBoxId", as: "requestedBox" });

export {
  User,
  Box,
  UserBox,
  Trade,
  Achievement,
  Token,
  TokenHistory,
  CollectionProbability,
  CollectionCost,
};
