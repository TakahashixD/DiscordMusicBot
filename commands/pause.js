const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pausa a musica"),
  run: async ({client, interaction}) => {
    const queue = client.player.getQueue(interaction.guildId)
    if(!queue) return await interaction.editReply("Não existe musica na fila")
    queue.setPaused(true)
    await interaction.editReply("Musica pausada! use /resume para voltar a tocar")
    
  }
}