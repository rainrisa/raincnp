import { deunionize, Scenes, session, Telegraf } from "telegraf";
import { MongoClient } from "mongodb";
import setDatabase from "./services/database.js";
import createPlayer from "./functions/createPlayer.js";
import playMatch from "./functions/playMatch.js";
import { IBattle } from "./interfaces/index.js";
import generateStringReply from "./functions/generateStringReply.js";
import generateMatchId from "./functions/generateMatchId.js";
import calculateTotalExp from "./functions/calculateTotalExp.js";
import generateMatchType from "./functions/generateMatchType.js";
import "./services/match.js";
import "dotenv/config";
import { Message } from "telegraf/typings/core/types/typegram.js";

if (!process.env.BOT_TOKEN) {
  console.log("Please provide BOT_TOKEN");
  process.exit();
}
if (!process.env.MDB_URI) {
  console.log("Please provide MDB_URI");
  process.exit();
}

interface MyWizardSession extends Scenes.WizardSessionData {
  clanName: string;
  founderName: string;
}
type MyContext = Scenes.WizardContext<MyWizardSession>;

const createClanWizard = new Scenes.WizardScene<MyContext>(
  "create-clan",
  async (ctx) => {
    await ctx.reply("Now send me the founder name");
    return ctx.wizard.next();
  },
  async (ctx) => {
    const message = deunionize(ctx.message);

    if (message && message.text) {
      if (message.text === "/quit") {
        await ctx.reply("Okay");
        return ctx.scene.leave();
      }
      ctx.scene.session.founderName = message.text.toLowerCase();
      const { clanName, founderName } = ctx.scene.session;
      const player = await PlayerModel.findOne({ name: founderName });

      if (!player) {
        return ctx.reply("Your input does not match any player, please try again or exit by typing /quit");
      }
      TeamModel.insertOne({
        name: clanName,
        type: "clan",
        founder: founderName,
        totalMatch: 0,
        win: 0,
        lose: 0,
      });
      await ctx.reply("Successfully insert new clan");
      return ctx.scene.leave();
    } else {
      return ctx.reply("Please provide the right name");
    }
  }
);
const createPlayersWizard = new Scenes.WizardScene<MyContext>(
  "create-players",
  async (ctx) => {
    await ctx.reply("Send me the list of players");
    return ctx.wizard.next();
  },
  async (ctx) => {
    const message = deunionize(ctx.message);

    if (message && message.text) {
      const listOfPlayers = message.text.split(/\s+/);

      try {
        await createPlayer(listOfPlayers);
      } finally {
        await ctx.reply("Successfully create players");
        return ctx.scene.leave();
      }
    } else {
      return ctx.reply("Please provide the right list of players");
    }
  }
);

const app = new Telegraf<MyContext>(process.env.BOT_TOKEN);
const stage = new Scenes.Stage<MyContext>([createPlayersWizard, createClanWizard]);
const client = new MongoClient(process.env.MDB_URI);
const rain = client.db("raincnp");

app.use(session());
app.use(stage.middleware());

// sort app.command alphabetically for easy searching
app.command("createplayer", async (ctx) => {
  const nations = await TeamModel.find({ type: "nation" }).toArray();

  if (!nations.length) {
    return ctx.reply("You don't have any nation, please create one with /createnation");
  }
  const playerName = ctx.message.text.split(" ")[1];

  if (!playerName) {
    return ctx.reply("Please provide player name");
  }
  try {
    await createPlayer(playerName);
  } catch (err) {
    return ctx.reply("Player already exist");
  }
  return ctx.reply("Successfully create player");
});

app.command("createplayers", async (ctx) => {
  const nations = await TeamModel.find({ type: "nation" }).toArray();

  if (!nations.length) {
    return ctx.reply("You don't have any nation, please create one with /createnation");
  }
  ctx.scene.enter("create-players");
});

app.command("createnation", async (ctx) => {
  const nationName = ctx.message.text.split(" ")[1];

  if (!nationName) {
    return ctx.reply("Please provide nation name");
  }
  await TeamModel.insertOne({
    name: nationName.toLowerCase(),
    type: "nation",
    totalMatch: 0,
    win: 0,
    lose: 0,
  });

  return ctx.reply("Successfully create nation");
});

app.command("createclan", async (ctx) => {
  const players = await PlayerModel.find().toArray();

  if (!players.length) {
    return ctx.reply("You don't have any player, please create one with /createplayer");
  }
  const clanName = ctx.message.text.split(" ")[1];

  if (!clanName) {
    return ctx.reply("Please provide clan name");
  }
  ctx.scene.session.clanName = clanName;
  ctx.scene.enter("create-clan");
});

// currently only support generalMatch
app.command("play", async (ctx) => {
  const players = await PlayerModel.find().toArray();
  const delay = +ctx.message.text.split(" ")[1] * 1000;

  if (players.length < 10) {
    return ctx.reply("You must have at least 10 players to start a match");
  }
  const waitingMessage = await ctx.replyWithHTML("<code>Terminal Running</code>");
  const matchType = generateMatchType();
  const matchId = generateMatchId(); // only for unique event emitter

  delay ? playMatch(players, matchId, matchType, delay) : playMatch(players, matchId, matchType);
  let message: Message.TextMessage;

  RainMatch.on("start" + matchId, async (result: IBattle) => {
    await app.telegram.deleteMessage(waitingMessage.chat.id, waitingMessage.message_id);
    message = await ctx.replyWithHTML(generateStringReply(result));
  });
  RainMatch.on("fight" + matchId, async (result, attacker, defender, damage) => {
    try {
      await app.telegram.editMessageText(
        message.chat.id,
        message.message_id,
        undefined,
        generateStringReply(result, attacker, defender, damage),
        {
          parse_mode: "HTML",
        }
      );
      // perhaps we should put empty string to ignore this? ""
    } catch (err) {} // Error: message content and reply markup are exactly the same as a current content
  });
  RainMatch.on("end" + matchId, async (result: IBattle) => {
    await app.telegram.deleteMessage(message.chat.id, message.message_id);
    await ctx.replyWithHTML(generateStringReply(result));

    await BattleModel.insertOne(result);
    await PlayerModel.bulkWrite(
      result.whiteTeam.players.map((player) => {
        return {
          updateOne: {
            filter: { name: player.name },
            update: {
              $inc: {
                "statistics.kill.generalMatch": player.kill,
                "statistics.death.generalMatch": player.death,
                totalExp: calculateTotalExp(player),
              },
            },
          },
        };
      })
    );
    await PlayerModel.bulkWrite(
      result.blackTeam.players.map((player) => {
        return {
          updateOne: {
            filter: { name: player.name },
            update: {
              $inc: {
                "statistics.kill.generalMatch": player.kill,
                "statistics.death.generalMatch": player.death,
                totalExp: calculateTotalExp(player),
              },
            },
          },
        };
      })
    );
    await ctx.reply("Saved into database!");
  });
});

app.command("getplayer", async (ctx) => {
  const playerName = ctx.message.text.split(" ")[1];

  if (!playerName) {
    return ctx.reply("Please provide player name");
  }
  const player = await PlayerModel.findOne({ name: playerName });

  if (!player) {
    return ctx.reply("Player not found");
  }
  const playerKill = Object.values(player.statistics.kill).reduce((x, y) => x + y);
  const playerDeath = Object.values(player.statistics.death).reduce((x, y) => x + y);

  return ctx.replyWithHTML(
    `<strong>Player Information</strong>\n\nName: <code>${player.name}</code>\nSkills:\n  Attack: <code>${player.skills[0]}</code>\n  Defense: <code>${player.skills[1]}</code>\n  Heal: <code>${player.skills[2]}</code>\nStatistics:\n  Kill: <code>${playerKill}</code>\n  Death: <code>${playerDeath}</code>\nGrade: <code>${player.grade}</code>\nTotal Exp: <code>${player.totalExp}</code>\nNation: <code>${player.nation}</code>`
  );
});

client.connect();

client.on("open", async () => {
  console.log("MDB Connected Successfully");
  await setDatabase(rain);
});

app.launch().then(async () => {
  const me = await app.telegram.getMe();
  console.log(`Successfully logged in as ${me.username}`);
});

process.once("SIGINT", () => app.stop("SIGINT"));
process.once("SIGTERM", () => app.stop("SIGTERM"));
