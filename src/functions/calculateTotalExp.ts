import { IBattlePlayer } from "../interfaces/index.js";

function calculateTotalExp(player: IBattlePlayer) {
  const killExp = 420;
  const deathExp = 120;

  let totalExp = 0;

  totalExp += player.kill * killExp;
  totalExp += player.death * deathExp;

  return totalExp;
}

export default calculateTotalExp;
