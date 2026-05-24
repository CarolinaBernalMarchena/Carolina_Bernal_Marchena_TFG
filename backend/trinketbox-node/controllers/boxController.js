import bcrypt from "bcrypt";
import {
  UserBox,
  Box,
  Trade,
  Token,
  TokenHistory,
  CollectionProbability,
  CollectionCost,
  User,
} from "../models/index.js";

export async function seedBoxes(req, res) {
  try {
    const { boxes, specialTrades = [] } = req.body;

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
}

//Endpoint para la tienda
export async function getShopBoxes(req, res) {
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
}

//Endpoint para obtener las cajas del usuario
export async function openBox(req, res) {
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
}

export async function getAllBoxes(req, res) {
  try {
    const boxes = await Box.findAll();
    res.json(boxes);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo cajas" });
  }
}

//Endpoint para obtener probabilidades
export async function getCollectionProbabilities(req, res) {
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
}

//Endpoint para crear o actualizar probabilidades
export async function updateCollectionProbabilities(req, res) {
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
}

export async function getUserCollection(req, res) {
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
}

export async function openRandomBox(req, res) {
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

    //Consumimos tokens
    tokenData.numTokens -= tokenCost;
    await tokenData.save();

    //Obtenemos todas las cajas de esa colección
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
      selectedBox = normalBoxes[Math.floor(Math.random() * normalBoxes.length)];
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
}

// Obtener costes por colección
export async function getCollectionCost(req, res) {
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
}

//Endpoint para guardar coste de una colección
export async function updateCollectionCost(req, res) {
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
}
