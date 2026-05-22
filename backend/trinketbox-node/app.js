import { Sequelize, DataTypes, Op } from "sequelize";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;
const SECRET_KEY = "mi_clave_secreta";

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => res.type("html").send(html));
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "trinketbox-database/database.sqlite",
});

//Modelo de usuario
const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "profile1",
  },
});

//Modelo de los coleccionables
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

//Modelo Cajas que tiene el usuario
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

//Modelo Intercambios
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

//Modelo Logros
const Achievement = sequelize.define(
  "Achievement",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    achievementId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unlockedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["userId", "achievementId"],
      },
    ],
  },
);

//Catálogo de logros
const ALL_ACHIEVEMENTS = [
  { id: 1, name: "Primer paso", condition: (stats) => stats.boxesCount >= 1 },
  { id: 2, name: "Viciado", condition: (stats) => stats.boxesCount >= 10 },
  {
    id: 3,
    name: "Coleccionista",
    condition: (stats) => stats.boxesCount >= 50,
  },
  { id: 4, name: "Suertudo", condition: (stats) => stats.specialCount >= 1 },
  { id: 5, name: "Destino", condition: (stats) => stats.specialCount >= 5 },
  {
    id: 6,
    name: "Dios del RNG",
    condition: (stats) => stats.specialCount >= 10,
  },
  { id: 7, name: "Permutante", condition: (stats) => stats.tradesCount >= 1 },
  {
    id: 8,
    name: "Negociador de oro",
    condition: (stats) => stats.tradesCount >= 10,
  },
  {
    id: 9,
    name: "Comerciante experto",
    condition: (stats) => stats.tradesCount >= 50,
  },
];

//Modelo Tokens
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

//Modelo historial de tokens
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

// Modelo probabilidades por colección
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

// Modelo coste de cajas por colección
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

//Relaciones
User.belongsToMany(Box, { through: UserBox });
Box.belongsToMany(User, { through: UserBox });

UserBox.belongsTo(User);
UserBox.belongsTo(Box);

Trade.belongsTo(Box, { foreignKey: "offeredBoxId", as: "offeredBox" });
Trade.belongsTo(Box, { foreignKey: "requestedBoxId", as: "requestedBox" });

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }

    req.user = user;
    next();
  });
}

//Función calcular logros
async function checkAndUnlockAchievements(userId, stats) {
  const unlocked = [];

  for (const achievement of ALL_ACHIEVEMENTS) {
    if (achievement.condition(stats)) {
      const exists = await Achievement.findOne({
        where: {
          userId,
          achievementId: achievement.id,
        },
      });

      if (!exists) {
        await Achievement.create({
          userId,
          achievementId: achievement.id,
        });

        unlocked.push(achievement.id);
      }
    }
  }

  return unlocked;
}
// Sincronizacion tablas
sequelize.sync();
//sequelize.sync({ force: true });
//Endpoints usuario
app.post("/register", async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" },
    ); //Generamos un token
    res.status(201).send({ user, token });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } }); //Buscamos al usuario por su email
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }
    console.log(password, user.password);
    const validPassword = await bcrypt.compare(password, user.password); //Comparamos la contraseña ingresada con la almacenada en la base de datos
    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      SECRET_KEY,
    ); //Generamos un token
    const { password: _, ...safeUser } = user.toJSON();
    res.json({ user: safeUser, token });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

app.put("/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password, currentPassword, profilePicture } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Es necesaria la contraseña actual" });
      }
      const validPassword = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!validPassword) {
        return res
          .status(400)
          .json({ message: "Contraseña actual incorrecta" });
      }
      user.password = await bcrypt.hash(password, 10);
    }
    if (profilePicture) {
      user.profilePicture = profilePicture;
    }
    await user.save();
    res.json({ message: "Usuario actualizado correctamente", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
});

//Endpoints cajas
app.post("/seed-boxes", async (req, res) => {
  try {
    const { boxes, specialTrades } = req.body;

    if (!boxes || !Array.isArray(boxes)) {
      return res.status(400).json({ message: "Formato inválido" });
    }

    for (const box of boxes) {
      if (box.id) {
        await Box.upsert({
          id: box.id,
          number: box.number,
          collection: box.collection,
          collectionUrl: box.collectionUrl,
          type: box.type,
          hasSpecial: box.hasSpecial,
          description: box.description,
          imageUrl: box.imageUrl,
          noForBuying: box.noForBuying,
        });
      } else {
        await Box.upsert({
          number: box.number,
          collection: box.collection,
          collectionUrl: box.collectionUrl,
          type: box.type,
          hasSpecial: box.hasSpecial,
          description: box.description,
          imageUrl: box.imageUrl,
          noForBuying: box.noForBuying,
        });
      }
    }

    const adminPassword = await bcrypt.hash("admin123", 10); //Hasheamos la contraseña del usuario admin

    await User.upsert({
      id: 0,
      email: "admin@gmail.com",
      name: "admin",
      role: "admin",
      password: adminPassword,
    });

    const todayStr = new Date().toLocaleDateString("sv-SE", {
      timeZone: "Europe/Madrid",
    });
    const userRico = await User.findOne({
      where: { email: "Carolinabm2000@gmail.com" },
    });
    await Token.upsert({
      userId: userRico.id,
      numTokens: 50,
      lastTokenDate: todayStr,
    });

    for (const trade of specialTrades) {
      await Trade.upsert({
        offeredBoxId: trade.offeredBoxId,
        requestedBoxId: trade.requestedBoxId,
        offeredBoxName: trade.offeredBoxName,
        requestedBoxName: trade.requestedBoxName,
        ownerId: 0,
        ownerName: "Intercambio especial",
        offeredBoxUrl: trade.offeredBoxUrl,
        requestedBoxUrl: trade.requestedBoxUrl,
        status: false,
      });
      await UserBox.upsert({
        UserId: 0,
        BoxId: trade.offeredBoxId,
        quantity: 1000,
      });
    }
    res.json({ message: "Cajas insertadas correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

//Endpoint para la tienda
app.get("/shop-boxes", authenticateToken, async (req, res) => {
  try {
    const boxes = await Box.findAll({
      order: [["id", "ASC"]],
    });

    if (!boxes.length) {
      return res.status(404).json({
        message: "No hay cajas disponibles",
      });
    }

    const today = new Date().toLocaleDateString("sv-SE", {
      timeZone: "Europe/Madrid",
    });

    // Generamos semilla diaria
    const daySeed = [...today].reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0,
    );

    function mulberry32(a) {
      return function () {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    const shuffled = [...boxes];
    const random = mulberry32(daySeed);

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const selectedBoxes = shuffled.slice(0, 3);

    const result = [];

    for (const box of selectedBoxes) {
      const existingCost = await CollectionCost.findOne({
        where: { collection: box.collection },
      });

      result.push({
        collection: box.collection,
        name: box.type,
        collectionUrl: box.collectionUrl,
        tokenCost: existingCost?.tokenCost ?? 1,
      });
    }

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error obteniendo cajas de tienda",
    });
  }
});

//Endpoint para obtener las cajas del usuario
app.post("/open-box/:boxId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { boxId } = req.params;

    const box = await Box.findByPk(boxId);

    if (!box) {
      return res.status(404).json({ message: "Caja no encontrada" });
    }

    //Buscamos si el usuario ya tiene esa caja
    let userBox = await UserBox.findOne({
      where: {
        UserId: userId,
        BoxId: boxId,
      },
    });

    if (userBox) {
      //Si ya la tiene la sumamos
      userBox.quantity += 1;
      await userBox.save();
    } else {
      //Si es la primera vez que la abre se le añade con cantidad igual a 1
      await UserBox.create({
        UserId: userId,
        BoxId: boxId,
        quantity: 1,
      });
    }

    res.json({
      message: "Caja añadida a la colección",
      box,
    });
  } catch (error) {
    res.status(500).json({ message: "Error abriendo caja" });
  }
});

app.get("/boxes", authenticateToken, async (req, res) => {
  try {
    const boxes = await Box.findAll();
    res.json(boxes);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo cajas" });
  }
});

//Obtener probabilidades
app.get("/collection-probabilities", authenticateToken, async (req, res) => {
  try {
    // Obtener colecciones existentes
    const boxes = await Box.findAll({
      attributes: ["collection"],
    });

    const uniqueCollections = [...new Set(boxes.map((b) => b.collection))];

    const probabilities = [];

    for (const collection of uniqueCollections) {
      const existing = await CollectionProbability.findOne({
        where: { collection },
      });

      probabilities.push({
        collection,
        normalProbability: existing?.normalProbability ?? 95,

        specialProbability: existing?.specialProbability ?? 5,
      });
    }

    probabilities.sort((a, b) => a.collection.localeCompare(b.collection));

    res.json(probabilities);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error obteniendo probabilidades",
    });
  }
});

// Crear o actualizar probabilidades
app.post("/collection-probabilities", authenticateToken, async (req, res) => {
  try {
    const collection = req.body.collection;

    const normalProbability = Number(req.body.normalProbability);
    const specialProbability = Number(req.body.specialProbability);

    if (normalProbability + specialProbability !== 100) {
      return res.status(400).json({
        message: "Las probabilidades deben sumar 100",
      });
    }

    await CollectionProbability.upsert({
      collection,
      normalProbability,
      specialProbability,
    });

    res.json({
      message: "Probabilidades guardadas correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error guardando probabilidades",
    });
  }
});

app.get("/my-collection/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    const userBoxes = await UserBox.findAll({
      where: { UserId: userId },
      include: [Box],
    });

    res.json(userBoxes);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo colección" });
  }
});

app.post(
  "/open-random-box/:collection",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { collection } = req.params;

      let tokenData = await Token.findOne({ where: { userId } });
      const costConfig = await CollectionCost.findOne({
        where: { collection },
      });

      const tokenCost = costConfig?.tokenCost ?? 1;

      if (!tokenData || tokenData.numTokens < tokenCost) {
        return res.status(400).json({
          message: "No tienes suficientes tokens",
        });
      }

      // Consumimos tokens
      tokenData.numTokens -= tokenCost;

      await tokenData.save();

      // Consumir 1 token
      tokenData.numTokens -= 1;
      await tokenData.save();

      // Obtenemos todas las cajas de esa colección
      const boxes = await Box.findAll({
        where: {
          collection,
          noForBuying: false,
        },
      });

      if (!boxes.length) {
        return res
          .status(404)
          .json({ message: "No hay cajas en esta colección" });
      }

      //Se elige una aleatoria
      const specialBoxes = boxes.filter((b) => b.hasSpecial);
      const normalBoxes = boxes.filter((b) => !b.hasSpecial);

      //Buscamos las probabilidades configuradas
      const probabilityConfig = await CollectionProbability.findOne({
        where: { collection },
      });

      const specialProbability = probabilityConfig?.specialProbability || 5;

      const isSpecial = Math.random() < specialProbability / 100;

      let selectedBox;

      if (isSpecial && specialBoxes.length) {
        selectedBox =
          specialBoxes[Math.floor(Math.random() * specialBoxes.length)];
      } else {
        selectedBox =
          normalBoxes[Math.floor(Math.random() * normalBoxes.length)];
      }

      await TokenHistory.create({
        userId,
        amount: tokenCost,
        type: "spent",
        reason: `Compra de caja de ${collection} → ${selectedBox.type}`,
        boxName: collection,
        resultBoxName: selectedBox.type,
      });

      //Añadimos la caja al usuario
      let userBox = await UserBox.findOne({
        where: {
          UserId: userId,
          BoxId: selectedBox.id,
        },
      });

      if (userBox) {
        userBox.quantity += 1;
        await userBox.save();
      } else {
        await UserBox.create({
          UserId: userId,
          BoxId: selectedBox.id,
          quantity: 1,
        });
      }

      res.json({
        message: "Caja abierta correctamente",
        box: selectedBox,
      });
    } catch (error) {
      console.error("OPEN BOX ERROR:", error);
      res.status(500).json({
        message: "Error al abrir la caja",
        error: error?.message || error,
      });
    }
  },
);

//Estadísticas del usuario
app.get("/profile-stats", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userBoxes = await UserBox.findAll({
      where: { UserId: userId },
      include: [Box],
    });

    let boxesCount = 0;
    let specialCount = 0;

    const tradesCount = await Trade.count({
      where: {
        status: true,
        [Op.or]: [{ ownerId: userId }, { acceptedBy: userId }],
      },
    });

    for (const ub of userBoxes) {
      boxesCount += ub.quantity;

      if (ub.Box.hasSpecial) {
        specialCount += ub.quantity;
      }
    }

    res.json({
      boxesCount,
      specialCount,
      tradesCount,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//Endpoints intercambios
//Obtener intercambios abiertos
app.get("/trades", authenticateToken, async (req, res) => {
  try {
    const trades = await Trade.findAll({
      where: { status: false },
      include: [
        { model: Box, as: "offeredBox" },
        { model: Box, as: "requestedBox" },
      ],
      order: [["date", "DESC"]],
    });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Crear un nuevo intercambio
app.post("/trades", authenticateToken, async (req, res) => {
  try {
    const [offeredBox, requestedBox] = await Promise.all([
      Box.findByPk(req.body.offeredBoxId),
      Box.findByPk(req.body.requestedBoxId),
    ]);

    if (!offeredBox || !requestedBox) {
      return res.status(404).json({ message: "Caja no encontrada" });
    }

    if (offeredBox.noForBuying || requestedBox.noForBuying) {
      return res.status(400).json({
        message:
          "Las cajas especiales no pueden usarse en intercambios de usuarios",
      });
    }

    const trade = await Trade.create({
      offeredBoxId: offeredBox.id,
      requestedBoxId: requestedBox.id,
      offeredBoxName: offeredBox.type,
      requestedBoxName: requestedBox.type,
      ownerId: req.user.id,
      ownerName: req.user.name,
      offeredBoxUrl: offeredBox.imageUrl,
      requestedBoxUrl: requestedBox.imageUrl,
      status: false,
    });

    res.json(trade);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error creando intercambio" });
  }
});

//Obtener los intercambios especiales
app.get("/trades/special", authenticateToken, async (req, res) => {
  try {
    const trades = await Trade.findAll({
      where: { ownerId: 0 },
      include: [
        { model: Box, as: "offeredBox" },
        { model: Box, as: "requestedBox" },
      ],
      order: [["date", "DESC"]],
    });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Creación de intercambios especiales por parte del usuario admin
app.post("/trades/special", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }

    const [offeredBox, requestedBox] = await Promise.all([
      Box.findByPk(req.body.offeredBoxId),
      Box.findByPk(req.body.requestedBoxId),
    ]);

    if (!offeredBox || !requestedBox) {
      return res.status(404).json({ message: "Caja no encontrada" });
    }

    const trade = await Trade.create({
      offeredBoxId: offeredBox.id,
      requestedBoxId: requestedBox.id,
      offeredBoxName: offeredBox.type,
      requestedBoxName: requestedBox.type,
      ownerId: 0,
      ownerName: "Intercambio especial",
      offeredBoxUrl: offeredBox.imageUrl,
      requestedBoxUrl: requestedBox.imageUrl,
      status: false,
    });

    await UserBox.upsert({ UserId: 0, BoxId: offeredBox.id, quantity: 1000 });

    res.json(trade);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error creando intercambio especial" });
  }
});

//Aceptar intercambio
app.put("/trades/:id/accept", authenticateToken, async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const trade = await Trade.findByPk(req.params.id, { transaction: t });

    if (!trade) {
      await t.rollback();
      return res.status(404).json({ message: "Intercambio no encontrado" });
    }

    if (trade.status) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "El intercambio ya fue aceptado" });
    }

    if (trade.ownerId === req.user.id) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "No puedes aceptar tu propio intercambio" });
    }

    const ownerId = trade.ownerId;
    const accepterId = req.user.id;

    //Intercambios especiales
    const offeredBox = await Box.findByPk(trade.offeredBoxId, {
      transaction: t,
    });

    const isGlobalTrade = offeredBox.noForBuying;

    const ownerOffered = await UserBox.findOne({
      where: { UserId: ownerId, BoxId: trade.offeredBoxId },
      transaction: t,
    });

    const accepterRequested = await UserBox.findOne({
      where: { UserId: accepterId, BoxId: trade.requestedBoxId },
      transaction: t,
    });

    if (!ownerOffered || ownerOffered.quantity < 1) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "El creador ya no tiene esa caja" });
    }

    if (!accepterRequested || accepterRequested.quantity < 1) {
      await t.rollback();
      return res.status(400).json({ message: "No tienes la caja solicitada" });
    }

    // ======================================================
    // INTERCAMBIO ESPECIAL (sistema)
    // ======================================================

    if (isGlobalTrade) {
      // Le damos la recompensa al usuario que pide la caja
      const accepterGets = await UserBox.findOne({
        where: {
          UserId: accepterId,
          BoxId: trade.offeredBoxId,
        },
        transaction: t,
      });

      accepterRequested.quantity -= 1;

      if (accepterRequested.quantity === 0) {
        await accepterRequested.destroy({ transaction: t });
      } else {
        await accepterRequested.save({ transaction: t });
      }

      if (accepterGets) {
        accepterGets.quantity += 1;

        await accepterGets.save({ transaction: t });
      } else {
        await UserBox.create(
          {
            UserId: accepterId,
            BoxId: trade.offeredBoxId,
            quantity: 1,
          },
          { transaction: t },
        );
      }
    }
    // ======================================================
    // INTERCAMBIO NORMAL
    // ======================================================
    else {
      // Quitamos cajas
      ownerOffered.quantity -= 1;

      if (ownerOffered.quantity === 0) {
        await ownerOffered.destroy({ transaction: t });
      } else {
        await ownerOffered.save({ transaction: t });
      }

      accepterRequested.quantity -= 1;

      if (accepterRequested.quantity === 0) {
        await accepterRequested.destroy({ transaction: t });
      } else {
        await accepterRequested.save({ transaction: t });
      }

      // Owner recibe requestedBox
      const ownerGets = await UserBox.findOne({
        where: {
          UserId: ownerId,
          BoxId: trade.requestedBoxId,
        },
        transaction: t,
      });

      if (ownerGets) {
        ownerGets.quantity += 1;

        await ownerGets.save({ transaction: t });
      } else {
        await UserBox.create(
          {
            UserId: ownerId,
            BoxId: trade.requestedBoxId,
            quantity: 1,
          },
          { transaction: t },
        );
      }

      //La persona que acepta el intercambio recibe offeredBox
      const accepterGets = await UserBox.findOne({
        where: {
          UserId: accepterId,
          BoxId: trade.offeredBoxId,
        },
        transaction: t,
      });

      if (accepterGets) {
        accepterGets.quantity += 1;

        await accepterGets.save({ transaction: t });
      } else {
        await UserBox.create(
          {
            UserId: accepterId,
            BoxId: trade.offeredBoxId,
            quantity: 1,
          },
          { transaction: t },
        );
      }

      //Marcamos trade como completado
      trade.status = true;
      trade.acceptedBy = accepterId;

      await trade.save({ transaction: t });
    }

    await t.commit();

    res.json({ message: "Intercambio realizado correctamente" });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

//Eliminar un intercambio
app.delete("/trades/:id", authenticateToken, async (req, res) => {
  try {
    const trade = await Trade.findByPk(req.params.id);

    if (!trade) {
      return res.status(404).json({ message: "Intercambio no encontrado" });
    }

    await trade.destroy();

    res.json({ message: "Intercambio eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando intercambio" });
  }
});

//Endpoint logros
app.get("/achievements", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const userBoxes = await UserBox.findAll({
      where: { UserId: userId },
      include: [Box],
    });

    let boxesCount = 0;
    let specialCount = 0;

    for (const ub of userBoxes) {
      boxesCount += ub.quantity;

      if (ub.Box.hasSpecial) {
        specialCount += ub.quantity;
      }
    }

    const tradesCount = await Trade.count({
      where: {
        status: true,
        [Op.or]: [{ ownerId: userId }, { acceptedBy: userId }],
      },
    });

    const stats = { boxesCount, specialCount, tradesCount };

    const newAchievements = await checkAndUnlockAchievements(userId, stats);

    //Tokens por logros nuevos
    if (newAchievements.length > 0) {
      await TokenHistory.create({
        userId,
        amount: newAchievements.length,
        type: "gain",
        reason: "Logro desbloqueado",
      });

      const tokenData = await Token.findOne({ where: { userId } });

      if (tokenData) {
        tokenData.numTokens += newAchievements.length;
        await tokenData.save();
      }
    }

    const userAchievements = await Achievement.findAll({
      where: { userId },
      order: [["unlockedAt", "DESC"]],
    });

    res.json({
      achievements: userAchievements.map((a) => ({
        achievementId: a.achievementId,
        unlockedAt: a.unlockedAt,
      })),
      newAchievements,
    });
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo logros" });
  }
});

//Endpoint Tokens
app.get("/token", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    let tokenData = await Token.findOne({ where: { userId } });

    const todayStr = new Date().toLocaleDateString("sv-SE", {
      timeZone: "Europe/Madrid",
    });

    //Si no existe información de tokens se lo generamos al usuario
    if (!tokenData) {
      tokenData = await Token.create({
        userId,
        numTokens: 5,
        lastTokenDate: todayStr,
      });

      return res.json({ tokens: tokenData.numTokens });
    }

    //Comparamos el día de hoy con el último día que el usuario inició sesión
    const lastDateStr = new Date(tokenData.lastTokenDate).toLocaleDateString(
      "sv-SE",
      {
        timeZone: "Europe/Madrid",
      },
    );

    //Si es un nuevo día añadimos un token nuevo al usuario
    if (lastDateStr !== todayStr) {
      tokenData.numTokens += 1;
      tokenData.lastTokenDate = new Date();
      await tokenData.save();
      await TokenHistory.create({
        userId,
        amount: 1,
        type: "gain",
        reason: "Recompensa diaria",
      });
    }

    res.json({ tokens: tokenData.numTokens });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener tokens" });
  }
});

//Endpoint historial de tokens
app.get("/token-history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await TokenHistory.findAll({
      where: { userId },
      order: [["date", "DESC"]],
      limit: 50,
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo historial" });
  }
});

// Obtener costes por colección
app.get("/collection-costs", authenticateToken, async (req, res) => {
  try {
    const boxes = await Box.findAll({
      attributes: ["collection"],
    });

    const uniqueCollections = [...new Set(boxes.map((b) => b.collection))];

    const costs = [];

    for (const collection of uniqueCollections) {
      const existing = await CollectionCost.findOne({
        where: { collection },
      });

      costs.push({
        collection,
        tokenCost: existing?.tokenCost ?? 1,
      });
    }

    costs.sort((a, b) => a.collection.localeCompare(b.collection));

    res.json(costs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error obteniendo costes",
    });
  }
});

// Guardar coste
app.post("/collection-costs", authenticateToken, async (req, res) => {
  try {
    const { collection } = req.body;

    const tokenCost = Number(req.body.tokenCost);

    if (tokenCost < 1) {
      return res.status(400).json({
        message: "El coste mínimo es 1",
      });
    }

    await CollectionCost.upsert({
      collection,
      tokenCost,
    });

    res.json({
      message: "Coste guardado correctamente",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error guardando coste",
    });
  }
});

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Bienvenido al backend de TrinketBox!
    </section>
  </body>
</html>
`;
