import { Telegraf } from "telegraf";
import { MongoClient } from "mongodb";
import setDatabase from "./services/database.js";
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
const client = new MongoClient(process.env.MDB_URI);
const rain = client.db("raincnp");

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
