import generateSkills from "./generateSkills.js";
import getRandomNumber from "./getRandomNumber.js";

async function createPlayer(playerName: string | string[]) {
  const nations = await TeamModel.find({ type: "nation" }).toArray();
  const nationNames = nations.map((nation) => nation.name);

  if (typeof playerName === "string") {
    playerName = playerName.toLowerCase();
    const skills = generateSkills();
    const nation = nationNames[getRandomNumber(0, nationNames.length - 1)];

    await PlayerModel.insertOne({
      name: playerName,
      skills,
      statistics: {
        kill: {
          generalMatch: 0,
          clanWar: 0,
          rfaMatchday: 0,
        },
        death: {
          generalMatch: 0,
          clanWar: 0,
          rfaMatchday: 0,
        },
      },
      grade: "Trainee",
      totalExp: 0,
      nation,
    });
  } else {
    await PlayerModel.insertMany(
      playerName.map((name) => {
        name = name.toLowerCase();
        const skills = generateSkills();
        const nation = nationNames[getRandomNumber(0, nationNames.length - 1)];

        return {
          name,
          skills,
          statistics: {
            kill: {
              generalMatch: 0,
              clanWar: 0,
              rfaMatchday: 0,
            },
            death: {
              generalMatch: 0,
              clanWar: 0,
              rfaMatchday: 0,
            },
          },
          grade: "Trainee",
          totalExp: 0,
          nation,
        };
      }),
      { ordered: false }
    );
  }
}

export default createPlayer;
