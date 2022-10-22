import getRandomNumber from "./getRandomNumber.js";

function generateSkills(total = 100) {
  const skills: number[] = [];

  const firstSkill = getRandomNumber(0, total);
  skills.push(firstSkill);
  total -= firstSkill;
  const secondSkill = getRandomNumber(0, total);
  skills.push(secondSkill);
  total -= secondSkill;
  skills.push(total);

  return skills;
}

export default generateSkills;
