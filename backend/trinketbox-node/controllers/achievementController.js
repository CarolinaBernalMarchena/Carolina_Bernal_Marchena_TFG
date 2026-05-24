import {
  UserBox,
  Box,
  Trade,
  Achievement,
  Token,
  TokenHistory,
} from "../models/index.js";
import { checkAndUnlockAchievements } from "../helpers/achievements.js";
import { Op } from "sequelize";

export async function getUserAchievements(req, res) {
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
}
