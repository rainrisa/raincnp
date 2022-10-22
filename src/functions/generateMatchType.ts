import { IMatchType } from "../interfaces/index.js";
import getRandomNumber from "./getRandomNumber.js";

function generateMatchType(): IMatchType {
  const matchTypeList: IMatchType[] = ["regularMatch", "clanWar", "rfaMatchday"];
  const matchType = matchTypeList[getRandomNumber(0, matchTypeList.length - 1)];

  return matchType;
}

export default generateMatchType;
