const { Client, GatewayIntentBits, Collection, MessageFlags, AttachmentBuilder } = require("discord.js")
const dotenv = require("dotenv");
dotenv.config({ path: "./private/private.env" });
const { DISCORD_TOKEN, BOT_ID } = process.env;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions],
    presence: {status: "dnd", activities: [{ name: "you", type: 2 }] }
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error("Error fetching message reaction:", error);
            return;
        }
    }

    console.log(`Reaction added by ${user.tag}: ${reaction.emoji.name} on message: ${reaction.message.id}`);

    if (reaction.message.author.id !== BOT_ID || user.bot) return console.log("Ignoring reaction from bot or not from the bot's message.");

    if (reaction.emoji.name === "white_check_mark") {
        await reaction.message.reply({ content: "Translation complete!" });
    } else if (reaction.emoji.name === "x") {
        await reaction.message.reply({ content: "Translation cancelled."});
    }
});

client.login(DISCORD_TOKEN).catch(console.error);