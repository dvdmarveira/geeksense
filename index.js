require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("clientReady", () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  console.log(`[${message.channel.name}] ${message.author.username}: ${message.content}`);

  if (message.content.toLowerCase() === "!ping") {
    await message.reply("Pong! 🏓");
  }

  if (message.content.toLowerCase() === "!sobre") {
    await message.reply("Sou o bot oficial do Clube Geek Uni 🤖");
  }
});

client.login(process.env.DISCORD_TOKEN);