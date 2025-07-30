//#region Imports
// Import necessary modules and packages
const {
  Client,
  GatewayIntentBits,
  MessageFlags,
  Collection,
} = require("discord.js");
const dotenv = require("dotenv");
dotenv.config({ path: "./private/private.env" });
const { DISCORD_TOKEN, API_KEY, OWNER_ID } = process.env;
const axios = require("axios");
const { embeds } = require("./embeds/embeds.js");
const { clear } = require("console");
const fs = require("fs");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  presence: { status: "dnd", activities: [{ name: "you", type: 2 }] },
});

//Map emojis for DeepL translation
const flagMap = {
  "🇦🇪": "AR", // Arabic
  "🇧🇬": "BG", // Bulgarian
  "🇨🇿": "CS", // Czech
  "🇩🇰": "DA", // Danish
  "🇩🇪": "DE", // German
  "🇬🇷": "EL", // Greek
  "🇬🇧": "EN-GB", // English (British)
  "🇺🇸": "EN-US", // English (American)
  "🇨🇦": "EN-US", // English (American)
  "🇦🇺": "EN-GB", // English (British)
  "🇪🇸": "ES", // Spanish (Spain)
  "🇪🇪": "ET", // Estonian
  "🇫🇮": "FI", // Finnish
  "🇫🇷": "FR", // French
  "🇮🇱": "HE", // Hebrew
  "🇭🇺": "HU", // Hungarian
  "🇮🇩": "ID", // Indonesian
  "🇮🇹": "IT", // Italian
  "🇯🇵": "JA", // Japanese
  "🇰🇷": "KO", // Korean
  "🇱🇹": "LT", // Lithuanian
  "🇱🇻": "LV", // Latvian
  "🇳🇱": "NL", // Dutch
  "🇵🇱": "PL", // Polish
  "🇵🇹": "PT-PT", // Portuguese (Portugal)
  "🇧🇷": "PT-BR", // Portuguese (Brazil)
  "🇲🇿": "PT-PT", // Portuguese (Mozambique)
  "🇦🇴": "PT-PT", // Portuguese (Angola)
  "🇷🇴": "RO", // Romanian
  "🇷🇺": "RU", // Russian
  "🇸🇰": "SK", // Slovak
  "🇸🇮": "SL", // Slovenian
  "🇸🇪": "SV", // Swedish
  "🇹🇭": "TH", // Thai
  "🇹🇷": "TR", // Turkish
  "🇺🇦": "UK", // Ukrainian
  "🇻🇳": "VI", // Vietnamese
  "🇨🇳": "ZH", // Chinese Simplified
};

//#endregion

//#region Commands Handler
function commandHandler() {
  const path = require("path");

  client.commands = new Collection();
  const foldersPath = path.join(__dirname, "commands");
  const commandFolders = fs.readdirSync(foldersPath);
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    console.log(`\nIn ${folder} folder : `);
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        console.log(`\t${file}`);
      } else {
        console.log(
          `[WARNING] The file ${file} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
}
//#endregion

//#region Ready!
// Event listener for when the bot is ready
client.once("ready", () => {
  clear();
  console.log(`Logged in as ${client.user.tag}`);
  commandHandler();
});
//#endregion

//#region Reaction Handler
// Event listener for message reactions

async function translateText(text, targetLang) {
  try {
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      new URLSearchParams({
        auth_key: API_KEY,
        text,
        target_lang: targetLang,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    return response.data.translations[0].text;
  } catch (error) {
    console.error("Error translating text:", error);
    throw new Error("Translation failed");
  }
}

client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return; // ignore bot reactions
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (e) {
      console.error(e);
      return;
    }
  }

  // check if the flag is supported
  if (!flagMap.hasOwnProperty(reaction.emoji.name)) {
    return; // skip unsupported languages
  }

  const original = reaction.message.content;
  if (!original) return; // nothing to translate

  try {
    const targetLang = flagMap[reaction.emoji.name];
    const translated = await translateText(original, targetLang);
    await reaction.message.reply(translated);
  } catch (error) {
    console.error("Translate error:", error);

    // Build error embed
    const errorEmbed = embeds({
      nameCommand: "Translate",
      description: null,
      color: "Red",
    });
    errorEmbed.addFields({ name: "Error", value: `${error}` });

    // Reply to the user
    try {
      await reaction.message.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    } catch (replyError) {
      console.error("Failed to reply with error embed:", replyError);
    }

    // Notify owner if OWNER_ID is set
    if (OWNER_ID) {
      errorEmbed.addFields(
        {
          name: "Jump to channel",
          value: `https://discord.com/channels/${reaction.message.guildId}/${reaction.message.channelId}`,
        },
        {
          name: "Executor",
          value: `<@${user.id}>`,
        }
      );
      try {
        const ownerUser = await client.users.fetch(OWNER_ID, false);
        await ownerUser.send({ embeds: [errorEmbed] });
      } catch (ownerError) {
        console.error("Failed to notify owner:", ownerError);
      }
    }
  }
});
//#endregion

//#region Interaction Event
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  const exceptionThrowed = embeds({
    nameCommand: interaction.commandName,
    userURL: interaction.user.displayAvatarURL(),
    description: `An error occurred while executing the command \`${interaction.commandName}\`.`,
    color: "Red",
  });

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    exceptionThrowed.addFields({ name: `Error`, value: `${error}` });
    await interaction.reply({
      embeds: [exceptionThrowed],
      flags: MessageFlags.Ephemeral,
    });
    if (OWNER_ID !== undefined) {
      exceptionThrowed.setDescription(null);
      exceptionThrowed.addFields(
        {
          name: `Jump to channel`,
          value: `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}`,
        },
        {
          name: `Executor`,
          value: `<@${
            (await interaction.guild.members.fetch(interaction.user.id)).id
          }>`,
        }
      );
      await interaction.client.users.fetch(OWNER_ID, false).then((user) => {
        user.send({ embeds: [exceptionThrowed] });
      });
    }
  }
});
//#endregion

//#region Login
// Login to Discord with the bot token
client.login(DISCORD_TOKEN).catch(console.error);
//#endregion
