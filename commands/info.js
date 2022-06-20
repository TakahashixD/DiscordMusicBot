const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Mostra as informações da musica atual"),
  run: async ({client, interaction}) => {
    const queue = client.player.getQueue(interaction.guildId);
    if(!queue) return await interaction.editReply("Não existe musica na fila")
    queue.createProgressBar({
      queue: false,
      length: 19
    })
    const song = queue.current
    await interaction.editReply({
      embeds: [new MessageEmbed()
               .setThumbnail(song.thumbnail)
               .setDescription(`Atualmente tocando [${song.title}](${song.url})\n\n`)]
    
    })
  
  }
}