const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Volta a tocar a musica"),
  run: async ({client, interaction}) => {
    const queue = client.player.getQueue(interaction.guildId)
    if(!queue) return await interaction.editReply("Não existe musica na fila")
    queue.setPaused(false)
    await interaction.editReply("Solta a batida")
    
  }
}