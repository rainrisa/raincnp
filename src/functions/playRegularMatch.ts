import { IBattle, IMatchType, IPlayer } from "../interfaces/index.js";
import getRandomNumber from "./getRandomNumber.js";
import shuffle from "./shuffle.js";

async function playMatch(players: IPlayer[], matchId: number, matchType: IMatchType, delay = 1000) {
  const totalRound = 5;

  if (matchType === "regularMatch") {
  }
  players = shuffle(players);
  players = players.slice(0, 10);

  const whiteTeam = players.slice(0, players.length / 2);
  const blackTeam = players.slice(players.length / 2);

  const result: IBattle = {
    whiteTeam: {
      score: 0,
      players: whiteTeam.map((player) => {
        return {
          name: player.name,
          clan: player.clan,
          nation: player.nation,
          kill: 0,
          death: 0,
          health: 100,
        };
      }),
    },
    blackTeam: {
      score: 0,
      players: blackTeam.map((player) => {
        return {
          name: player.name,
          clan: player.clan,
          nation: player.nation,
          kill: 0,
          death: 0,
          health: 100,
        };
      }),
    },
  };
  setImmediate(() => {
    RainMatch.emit("start" + matchId, result); // https://stackoverflow.com/a/44220594
  });
  await new Promise((resolve) => setTimeout(resolve, delay));

  // to satisfied, MongoDB Error: clan must be a string or undefined
  // and if undefined we shouldn't store the value and we must remove it
  // because if we store an undefined clan field, mongodb will throw an error
  result.whiteTeam.players.forEach((player) => (player.clan ? "" : delete player.clan));
  result.blackTeam.players.forEach((player) => (player.clan ? "" : delete player.clan));

  while (result.whiteTeam.score < totalRound && result.blackTeam.score < totalRound) {
    const whiteTeamClone = whiteTeam.slice();
    const blackTeamClone = blackTeam.slice();

    result.whiteTeam.players.forEach((player) => (player.health = 100));
    result.blackTeam.players.forEach((player) => (player.health = 100));
    whiteTeamClone.forEach((player) => (player.health = 100));
    blackTeamClone.forEach((player) => (player.health = 100));

    while (whiteTeamClone.length && blackTeamClone.length) {
      await new Promise((resolve) => setTimeout(resolve, delay));

      shuffle(whiteTeamClone);
      shuffle(blackTeamClone);

      const fighters = [
        { self: whiteTeamClone.shift()!, team: whiteTeamClone },
        { self: blackTeamClone.shift()!, team: blackTeamClone },
      ];
      const attacker = fighters.splice(Math.round(Math.random()), 1)[0];
      const defender = fighters[0];

      const attackPower = getRandomNumber(0, attacker.self.skills[0]);
      const defensePower = getRandomNumber(0, defender.self.skills[1]);
      const damage = attackPower < defensePower ? 0 : attackPower - defensePower;

      attacker.team.push(attacker.self);
      defender.self.health! -= damage;

      const attackerInWhiteTeam = result.whiteTeam.players.find((player) => player.name === attacker.self.name);
      const attackerInBlackTeam = result.blackTeam.players.find((player) => player.name === attacker.self.name);
      const defenderInWhiteTeam = result.whiteTeam.players.find((player) => player.name === defender.self.name);
      const defenderInBlackTeam = result.blackTeam.players.find((player) => player.name === defender.self.name);

      if (attackerInWhiteTeam && defenderInBlackTeam) {
        if (defender.self.health! > 0) {
          defender.team.push(defender.self);
        } else {
          defender.self.health = 0;
          attackerInWhiteTeam.kill++;
          defenderInBlackTeam.death++;
        }
        defenderInBlackTeam.health = defender.self.health;
      }
      if (attackerInBlackTeam && defenderInWhiteTeam) {
        if (defender.self.health! > 0) {
          defender.team.push(defender.self);
        } else {
          defender.self.health = 0;
          attackerInBlackTeam.kill++;
          defenderInWhiteTeam.death++;
        }
        defenderInWhiteTeam.health = defender.self.health;
      }
      RainMatch.emit("fight" + matchId, result, attacker, defender, damage);
    }
    if (whiteTeamClone.length) {
      result.whiteTeam.score++;
    }
    if (blackTeamClone.length) {
      result.blackTeam.score++;
    }
  }
  await new Promise((resolve) => setTimeout(resolve, delay));
  RainMatch.emit("end" + matchId, result);

  return result;
}

export default playMatch;
