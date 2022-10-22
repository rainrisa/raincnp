import getRandomNumber from "./getRandomNumber.js";

// matchId for unique event emitter
function generateMatchId(): number {
  const matchId = getRandomNumber(10000, 79999);
  if (String(matchId).startsWith("6")) return generateMatchId();
  return matchId;
}

export default generateMatchId;
