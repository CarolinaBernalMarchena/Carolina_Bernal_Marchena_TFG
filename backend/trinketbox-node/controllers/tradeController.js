import sequelize from "../config/database.js";
import { Trade, Box, UserBox } from "../models/index.js";

//Obtener intercambios abiertos
export async function getAllTrades(req, res) {
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
}

//Crear un nuevo intercambio
export async function createTrade(req, res) {
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
}

//Obtener los intercambios especiales
export async function getSpecialTrades(req, res) {
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
}

//Creación de intercambios especiales por parte del usuario admin
export async function createSpecialTrades(req, res) {
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
}

//Aceptar intercambio
export async function acceptTrade(req, res) {
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

    //INTERCAMBIO ESPECIAL (sistema)

    if (isGlobalTrade) {
      //Le damos la recompensa al usuario que pide la caja
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
    //INTERCAMBIO NORMAL
    else {
      //Quitamos cajas
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

      //Owner recibe requestedBox
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
}

//Eliminar un intercambio
export async function deleteTrade(req, res) {
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
}
