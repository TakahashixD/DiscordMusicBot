const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Embaralha a fila"),
  run: async ({client, interaction}) => {
    const queue = client.player.getQueue(interaction.guildId)
    if(!queue) return await interaction.editReply("Não existe musica na fila")
    queue.shuffle()
    await interaction.editReply(`a fila ${queue.tracks.length} teve suas musicas embaralhadas!`)
  }
}