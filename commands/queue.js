const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("queue")
  .setDescription("mostra a fila de musicas atual")
  .addNumberOption((option) => option.setName("page").setDescription("Pagina numero de filas").setMinValue(1)),
  run: async({client, interaction}) => {
    const queue = client.player.getQueue(interaction.guildId)
    if(!queue || !queue.playing){
      return await interaction.editReply("Não existe musica na fila")
    }
    const totalPages = Math.ceil(queue.tracks.length/10) || 1
    const page = (interaction.options.getNumber("page") || 1) - 1
    if(page > totalPages)
      return await interaction.editReply(`Pagina invalida. Existe apenas um total de ${totalPages} paginas de musicas`)
    const queueString = queue.tracks.slice(page*10, page*10+10).map((song,i) =>{
      return `**${page * 10 + i + 1}.** \`[${song.duration}]\`${song.title} -- <@${song.requestedBy.id}>`
    }).join("\n")

    const currentSong = queue.current

    await interaction.editReply({
      embeds: [
        new MessageEmbed().setDescription(`**Atualmente tocando**\n` + (currentSong ? `\`[${currentSong.duration}]\`${currentSong.title} -- <@${currentSong.requestedBy.id}>`: "Nada") + `\n\n**Fila**\n${queueString}`
                                         )
        .setFooter({
          text: `Pagina ${page + 1} de ${totalPages} `
        })
        .setThumbnail(currentSong.thumbnail)
      ]
    })
  }
}