import { Achievement, Token, TokenHistory } from "../models/index.js";

export const ALL_ACHIEVEMENTS = [
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

//Función calcular logros
export async function checkAndUnlockAchievements(userId, stats) {
  const unlocked = [];

  for (const achievement of ALL_ACHIEVEMENTS) {
    if (achievement.condition(stats)) {
      const exists = await Achievement.findOne({
        where: { userId, achievementId: achievement.id },
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
