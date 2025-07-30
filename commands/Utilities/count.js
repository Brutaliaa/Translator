//#region Imports
const { CommandInteraction, SlashCommandBuilder } = require("discord.js");
const { embeds } = require("../../embeds/embeds.js");
const axios = require("axios");
const { API_KEY } = process.env;
//#endregion

//#region Execute Function
module.exports = {
  data: new SlashCommandBuilder()
    .setName("count")
    .setDescription("Show the current usage of the bot, and remaining usage.")
    .setContexts(0), // 0 = Guild Only - 1 = BotDM - 2 = Groups DMs and DMs other than the bot
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const embed = embeds({
      nameCommand: interaction.commandName,
      userURL: interaction.user.displayAvatarURL(),
      description: "Fetching usage data...",
      color: "Blue",
    });

    await interaction.reply({
      embeds: [embed],
      withResponse: true,
    });

    try {
      const response = await axios.get("https://api-free.deepl.com/v2/usage", {
        params: { auth_key: API_KEY },
      });
      const { character_count, character_limit } = response.data;

      embed
        .setDescription(
          `Current usage: ${character_count} characters\nRemaining usage: ${
            character_limit - character_count
          } characters`
        )
        .setColor("Green");
    } catch (error) {
      console.error("Error fetching usage data:", error);
      embed
        .setDescription("Failed to fetch usage data. Please try again later.")
        .setColor("Red");
    }

    return interaction.editReply({ embeds: [embed] });
  },
};
//#endregion
