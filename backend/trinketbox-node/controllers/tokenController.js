import { Token, TokenHistory } from "../models/index.js";

export async function getUserTokens(req, res) {
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
}

//Endpoint historial de tokens
export async function getTokenHistory(req, res) {
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
}
