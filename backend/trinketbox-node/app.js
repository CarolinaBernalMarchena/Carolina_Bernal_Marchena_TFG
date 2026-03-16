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

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'trinketbox-database/database.sqlite'
});

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
}, {});

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

sequelize.sync();

app.post('/register', async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...req.body,
      password: hashedPassword
    });
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' }); //Generamos un token
    res.status(201).send({ user, token });
  } catch (error) {
    return res.status(400).json({ message: "Email ya en uso" });
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

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' }); //Generamos un token
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
