import { Db, Collection } from "mongodb";
import { IBattle, IGrade, IPlayer, ITeam } from "../interfaces/index.js";
import { BattleSchema, GradeSchema, PlayerSchema, TeamSchema } from "./schema.js";

declare global {
  var PlayerModel: Collection<IPlayer>;
  var TeamModel: Collection<ITeam>;
  var GradeModel: Collection<IGrade>;
  var BattleModel: Collection<IBattle>;
}

async function setDatabase(rain: Db) {
  rain.createCollection("players", PlayerSchema).catch(() => {});
  rain.createCollection("teams", TeamSchema).catch(() => {});
  rain.createCollection("grades", GradeSchema).catch(() => {});
  rain.createCollection("battles", BattleSchema).catch(() => {});

  global.PlayerModel = rain.collection("players");
  global.TeamModel = rain.collection("teams");
  global.GradeModel = rain.collection("grades");
  global.BattleModel = rain.collection("battles");
}

export default setDatabase;
