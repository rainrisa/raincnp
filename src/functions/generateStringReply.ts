import { IBattle, IBattleFighter, IMatchType } from "../interfaces/index.js";

function generateStringReply(
  result: IBattle,
  type: IMatchType = "regularMatch",
  attacker?: IBattleFighter,
  defender?: IBattleFighter,
  damage?: number
) {
  let string = "";

  result.whiteTeam.players.sort((x, y) => y.kill - x.kill || x.death - y.death || y.health! - x.health!);
  result.blackTeam.players.sort((x, y) => y.kill - x.kill || x.death - y.death || y.health! - x.health!);

  if (!attacker && !defender) {
    if (result.whiteTeam.players[0].health! === 100 && result.blackTeam.players[0].health! === 100) {
      string += `<strong>MATCH STARTED</strong>\n\n`;
    } else {
      string += `<strong>MATCH FINISHED</strong>\n\n`;
    }
  }
  if (type === "clanWar") {
    string += `<strong>${result.whiteTeam.players[0].clan} ${result.whiteTeam.score}</strong>\n\n`;
  } else if (type === "rfaMatchday") {
    string += `<strong>${result.whiteTeam.players[0].nation} ${result.whiteTeam.score}</strong>\n\n`;
  } else {
    string += `<strong>White Team ${result.whiteTeam.score}</strong>\n\n`;
  }
  result.whiteTeam.players.forEach((player) => {
    string += `<code>${player.name}</code> <strong>Kill</strong>: <code>${player.kill}</code> <strong>Death</strong>: <code>${player.death}</code> <strong>Health</strong>: <code>${player.health}</code>`;
    string += "\n";
  });
  string += "\n";

  if (type === "clanWar") {
    string += `<strong>${result.blackTeam.players[0].clan} ${result.blackTeam.score}</strong>\n\n`;
  } else if (type === "rfaMatchday") {
    string += `<strong>${result.blackTeam.players[0].nation} ${result.blackTeam.score}</strong>\n\n`;
  } else {
    string += `<strong>Black Team ${result.blackTeam.score}</strong>\n\n`;
  }
  result.blackTeam.players.forEach((player) => {
    string += `<code>${player.name}</code> <strong>Kill</strong>: <code>${player.kill}</code> <strong>Death</strong>: <code>${player.death}</code> <strong>Health</strong>: <code>${player.health}</code>`;
    string += "\n";
  });
  string += "\n";

  if (attacker && defender) {
    if (defender.self.health) {
      string += `<strong>${attacker.self.name}</strong> attack <strong>${defender.self.name}</strong> <code>-${damage}</code>`;
    } else {
      string += `<strong>${attacker.self.name}</strong> kill <strong>${defender.self.name}</strong> <code>-${damage}</code>`;
    }
  }
  return string;
}

export default generateStringReply;
