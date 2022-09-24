import { Telegraf } from "telegraf";
import "dotenv/config";

if (!process.env.BOT_TOKEN) {
  console.log("Please provide BOT_TOKEN");
  process.exit();
}
if (!process.env.MDB_URI) {
  console.log("Please provide MDB_URI");
  process.exit();
}

const app = new Telegraf(process.env.BOT_TOKEN);

app.launch().then(async () => {
  const me = await app.telegram.getMe();
  console.log(`Successfully logged in as ${me.username}`);
});

process.once("SIGINT", () => app.stop("SIGINT"));
process.once("SIGTERM", () => app.stop("SIGTERM"));
