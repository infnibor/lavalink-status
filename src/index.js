require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { readdirSync } = require("fs");
const Manager = require("./wrapper/index");
const { nodes } = require("./config");
const colors = require("colors");

const client = new Client({
  disableMentions: "everyone",
  partials: [Partials.Channel, Partials.Message],
  intents: [GatewayIntentBits.Guilds],
});

process.on("unhandledRejection", (error) => {
  console.log(error);
});
process.on("uncaughtException", (error) => {
  console.log(error);
});

client.manager = new Manager(client, {
  nodes,
});

readdirSync("./src/events/").forEach((file) => {
  const event = require(`./events/${file}`);
  let eventName = file.split(".")[0];
  console.log(colors.green(`[EVENTS] Loaded [${client._eventsCount}] events`));
  client.on(eventName, event.bind(null, client));
});

client.login(process.env.TOKEN).then(() => {
  console.log(colors.green("[BOT] Logged in successfully"));
});

if (process.env.WEBMONITOR === "true") {
  require("./web/server");
}
