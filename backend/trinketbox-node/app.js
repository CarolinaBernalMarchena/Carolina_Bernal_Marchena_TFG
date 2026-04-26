import { Sequelize, DataTypes } from 'sequelize';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;
const SECRET_KEY = "mi_clave_secreta";

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => res.type('html').send(html));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'trinketbox-database/database.sqlite'
});

//Modelo de usuario
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
});

//Modelo de los coleccionables
const Box = sequelize.define('Box', {
  number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  collection: {
    type: DataTypes.STRING,
    allowNull: false
  },
  collectionUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hasSpecial: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  indexes: [
    {
      unique: true,
      fields: ['number', 'collection']
    }
  ]
});

//Modelo Cajas que tiene el usuario
const UserBox = sequelize.define('UserBox', {
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }}, {
  indexes: [
    {
      unique: true,
      fields: ['UserId', 'BoxId']  
    }
  ]

});

//Modelo Intercambios
const Trade = sequelize.define('Trade', {
  date:{
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ownerId:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ownerName:{
    type: DataTypes.STRING,
    allowNull: false
  }, 
  offeredBoxId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  requestedBoxId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  offeredBoxName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  requestedBoxName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  acceptedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  offeredBoxUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  requestedBoxUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

//Modelo Logros
const Achievement = sequelize.define('Achievement', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  achievementId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'achievementId']
    }
  ]
});

//Catálogo de logros
const ALL_ACHIEVEMENTS = [
  { id: 1, name: 'Primer paso', condition: (stats) => stats.boxesCount >= 1 },
  { id: 2, name: 'Viciado', condition: (stats) => stats.boxesCount >= 10 },
  { id: 3, name: 'Coleccionista', condition: (stats) => stats.boxesCount >= 50 },
  { id: 4, name: 'Suertudo', condition: (stats) => stats.specialCount >= 1 },
  { id: 5, name: 'Dios del RNG', condition: (stats) => stats.specialCount >= 5 }
];

//Relaciones
User.belongsToMany(Box, { through: UserBox });
Box.belongsToMany(User, { through: UserBox });

UserBox.belongsTo(User); 
UserBox.belongsTo(Box);

Trade.belongsTo(Box, { foreignKey: 'offeredBoxId', as: 'offeredBox' });
Trade.belongsTo(Box, { foreignKey: 'requestedBoxId', as: 'requestedBox' });

function authenticateToken(req, res, next) {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

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
          achievementId: achievement.id
        }
      });

      if (!exists) {
        await Achievement.create({
          userId,
          achievementId: achievement.id
        });

        unlocked.push(achievement.id);
      }

    }

  }

  return unlocked;
}
// Sincronizacion tablas
sequelize.sync();

//Endpoints usuario
app.post('/register', async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...req.body,
      password: hashedPassword
    });
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET_KEY, { expiresIn: '1h' }); //Generamos un token
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

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET_KEY, { expiresIn: '1h' }); //Generamos un token
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

app.put("/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password, currentPassword } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    if (name){
      user.name = name;
    }
    if (email){
      user.email = email;
    }
    if (password){
      if (!currentPassword) {
        return res.status(400).json({ message: "Es necesaria la contraseña actual" });
      }
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Contraseña actual incorrecta" });
      }
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    res.json({message: "Usuario actualizado correctamente", user});
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
});

//Endpoints cajas
app.post('/seed-boxes', async (req, res) => {

  try {

    const { boxes } = req.body;

    if (!boxes || !Array.isArray(boxes)) {
      return res.status(400).json({ message: "Formato inválido" });
    }

    for (const box of boxes) {

      await Box.upsert({
        number: box.number,
        collection: box.collection,
        collectionUrl: box.collectionUrl,
        type: box.type,
        hasSpecial: box.hasSpecial,
        description: box.description,
        imageUrl: box.imageUrl
      });

    }

    res.json({ message: "Cajas insertadas correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al insertar las cajas" });
  }

});

//Endpoint para la tienda
app.get('/shop-boxes', authenticateToken, async (req, res) => {
  try {

    const boxes = await Box.findAll();
    const shuffled = boxes.sort(() => 0.5 - Math.random());
    const unique = [];
    const usedIds = new Set();

    let selected = [];

    for (let box of shuffled) {
      if (!usedIds.has(box.id)) {
        unique.push(box);
        usedIds.add(box.id);
      }
      if (unique.length === 3) {
        break;
      }
    }

    if (!boxes.length) {
      return res.status(404).json({ message: "No hay cajas disponibles" });
    }

    while(selected.length < 3) {
      selected.push(...shuffled);
    }
    selected = selected.slice(0, 3);

    const result = selected.map(box => ({
      collection: box.collection,
      name: box.type,
      collectionUrl: box.collectionUrl
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: "Error obteniendo cajas de tienda" });
  }
});

//Endpoint para obtener las cajas del usuario
app.post('/open-box/:boxId', authenticateToken, async (req, res) => {

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
        BoxId: boxId
      }
    });

    if (userBox) {
      //Si ya la tiene → sumamos
      userBox.quantity += 1;
      await userBox.save();
    } else {
      //Si es la primera vez que la abre
      await UserBox.create({
        UserId: userId,
        BoxId: boxId,
        quantity: 1
      });
    }

    res.json({
      message: "Caja añadida a la colección",
      box
    });

  } catch (error) {
    res.status(500).json({ message: "Error abriendo caja" });
  }

});

app.get('/boxes', authenticateToken, async (req, res) => {
  try {
    const boxes = await Box.findAll();
    res.json(boxes);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo cajas" });
  }
});

app.get('/my-collection/:userId', authenticateToken, async (req, res) => {

  try {

    const userId = req.params.userId;

    const userBoxes = await UserBox.findAll({
      where: { UserId: userId },
      include: [Box]
    });

    res.json(userBoxes);

  } catch (error) {
    res.status(500).json({ message: "Error obteniendo colección" });
  }

});

app.post('/open-random-box/:collection', authenticateToken, async (req, res) => {

  try {

    const userId = req.user.id;
    const { collection } = req.params;

    //Obtenemos todas las cajas de esa colección
    const boxes = await Box.findAll({
      where: { collection }
    });

    if (!boxes.length) {
      return res.status(404).json({ message: "No hay cajas en esta colección" });
    }

    // Se elige una aleatoria
    const specialBoxes = boxes.filter(b => b.hasSpecial);
    const normalBoxes = boxes.filter(b => !b.hasSpecial);

    const isSpecial = Math.random() < 0.1; //10% probabilidad

    let selectedBox;

    if (isSpecial && specialBoxes.length) {
      selectedBox = specialBoxes[Math.floor(Math.random() * specialBoxes.length)];
    } else {
      selectedBox = normalBoxes[Math.floor(Math.random() * normalBoxes.length)];
    }

    //Buscamos si el usuario ya la tiene
    let userBox = await UserBox.findOne({
      where: {
        UserId: userId,
        BoxId: selectedBox.id
      }
    });

    if (userBox) {
      userBox.quantity += 1;
      await userBox.save();
    } else {
      await UserBox.create({
        UserId: userId,
        BoxId: selectedBox.id,
        quantity: 1
      });
    }

    res.json({
      message: "Caja abierta correctamente",
      box: selectedBox
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al abrir la caja" });
  }

});

//Estadísticas del usuario
app.get('/profile-stats', authenticateToken, async (req, res) => {
  try {

    const userId = req.user.id;
    const userBoxes = await UserBox.findAll({
      where: { UserId: userId },
      include: [Box]
    });

    let boxesCount = 0;
    let specialCount = 0;

    for (const ub of userBoxes) {
      boxesCount += ub.quantity;

      if (ub.Box.hasSpecial) {
        specialCount += ub.quantity;
      }
    }

    res.json({
      boxesCount,
      specialCount,
      tradesCount: 0
    });

  } catch (error) {
    res.status(500).json({ message: "Error al obtener las estadísticas" });
  }
});

//Endpoints intercambios
//Obtener intercambios abiertos
app.get('/trades', authenticateToken, async (req, res) => {
  try {

    const trades = await Trade.findAll({
      where: { status: false },
      include: [
        {
          model: Box,
          as: 'offeredBox'
        },
        {
          model: Box,
          as: 'requestedBox'
        }
      ]
    });

    res.json(trades);

  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//Crear un nuevo intercambio
app.post('/trades', authenticateToken, async (req, res) => {
  try {
    const requestedBox = await Box.findOne({
      where: { id:req.body.requestedBoxId}
    });
    const offeredBox = await Box.findOne({
      where: { id:req.body.offeredBoxId}
    })

    const trade = await Trade.create({
      offeredBoxId: req.body.offeredBoxId,
      requestedBoxId: req.body.requestedBoxId,
      offeredBoxName: offeredBox.type,
      requestedBoxName: requestedBox.type,
      ownerId: req.user.id,
      ownerName: req.user.name,
      offeredBoxUrl: offeredBox.imageUrl,
      requestedBoxUrl: requestedBox.imageUrl,
      status: false
    });

    res.json(trade);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Error creando intercambio" });
  }
});

//Aceptar intercambio
app.put('/trades/:id/accept', authenticateToken, async (req, res) => {
  const t = await sequelize.transaction();

  try {

    const trade = await Trade.findByPk(req.params.id, { transaction: t });

    if (!trade) {
      await t.rollback();
      return res.status(404).json({ message: "Intercambio no encontrado" });
    }

    if (trade.status === true) {
      await t.rollback();
      return res.status(400).json({ message: "El intercambio ya fue aceptado" });
    }

    if (trade.ownerId === req.user.id) {
      await t.rollback();
      return res.status(400).json({ message: "No puedes aceptar tu propio intercambio" });
    }

    const ownerId = trade.ownerId;
    const accepterId = req.user.id;

    const ownerOffered = await UserBox.findOne({
      where: { UserId: ownerId, BoxId: trade.offeredBoxId },
      transaction: t
    });

    const accepterRequested = await UserBox.findOne({
      where: { UserId: accepterId, BoxId: trade.requestedBoxId },
      transaction: t
    });

    if (!ownerOffered || ownerOffered.quantity < 1) {
      await t.rollback();
      return res.status(400).json({ message: "El creador ya no tiene esa caja" });
    }

    if (!accepterRequested || accepterRequested.quantity < 1) {
      await t.rollback();
      return res.status(400).json({ message: "No tienes la caja solicitada" });
    }

    //Restamos las cajas solicitadas a los respectivos usuarios
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

    //Añadimos las cajas a los usuarios
    const ownerGets = await UserBox.findOne({
      where: { UserId: ownerId, BoxId: trade.requestedBoxId },
      transaction: t
    });

    if (ownerGets) {
      ownerGets.quantity += 1;
      await ownerGets.save({ transaction: t });
    } else {
      await UserBox.create({
        UserId: ownerId,
        BoxId: trade.requestedBoxId,
        quantity: 1
      }, { transaction: t });
    }

    //La persona que acepta el intercambio recibe offeredBox
    const accepterGets = await UserBox.findOne({
      where: { UserId: accepterId, BoxId: trade.offeredBoxId },
      transaction: t
    });

    if (accepterGets) {
      accepterGets.quantity += 1;
      await accepterGets.save({ transaction: t });
    } else {
      await UserBox.create({
        UserId: accepterId,
        BoxId: trade.offeredBoxId,
        quantity: 1
      }, { transaction: t });
    }

    //Eliminar intercambio
    await trade.destroy({ transaction: t });
    await t.commit();

    res.json({ message: "Intercambio realizado correctamente" });

  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

//Eliminar un intercambio
app.delete('/trades/:id', authenticateToken, async (req, res) => {
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
app.get('/achievements', authenticateToken, async (req, res) => {
  try {

    const userId = req.user.id;

    //Reutilizamos la lógica existente
    const userBoxes = await UserBox.findAll({
      where: { UserId: userId },
      include: [Box]
    });

    let boxesCount = 0;
    let specialCount = 0;

    for (const ub of userBoxes) {
      boxesCount += ub.quantity;

      if (ub.Box.hasSpecial) {
        specialCount += ub.quantity;
      }
    }

    const stats = { boxesCount, specialCount };

    //Desbloqueamos nuevos logros automáticamente
    const newAchievements = await checkAndUnlockAchievements(userId, stats);

    //Obtenemos todos los desbloqueados
    const userAchievements = await Achievement.findAll({
      where: { userId }
    });

    res.json({
      unlockedIds: userAchievements.map(a => a.achievementId),
      newAchievements
    });

  } catch (error) {
    res.status(500).json({ message: "Error obteniendo logros" });
  }
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

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
      Hello from Render!
    </section>
  </body>
</html>
`
