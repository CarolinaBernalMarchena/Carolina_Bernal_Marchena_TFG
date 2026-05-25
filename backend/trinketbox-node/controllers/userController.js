import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { User, UserBox, Box, Trade } from "../models/index.js";

export async function register(req, res) {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" },
    ); //Generamos un token
    res.status(201).send({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error });
  }
}

export async function login(req, res) {
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
      process.env.SECRET_KEY,
    ); //Generamos un token
    const { password: _, ...safeUser } = user.toJSON();
    res.json({ user: safeUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
}

export async function updateUser(req, res) {
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
}

export async function getUserStats(req, res) {
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

    res.json({ boxesCount, specialCount, tradesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
}
