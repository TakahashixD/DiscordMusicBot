const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quit")
    .setDescription("Para o bot e limpa a fila"),
  run: async ({client, interaction}) => {
    const queue = client.player.getQueue(interaction.guildId)
    if(!queue) return await interaction.editReply("Não existe musica na fila")
    queue.destroy()
    await interaction.editReply("Tchau")
    
  }
}