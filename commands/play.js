const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");
const {QueryType} = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("play")
  .setDescription("Carrega musicas do youtube")
  .addSubcommand((subcommand) => 
    subcommand
    .setName("song")
    .setDescription("Carrega uma musica de um URL")
    .addStringOption((option) => option.setName("url").setDescription("url da musica").setRequired(true)))
  .addSubcommand((subcommand) => 
    subcommand
    .setName("playlist")
    .setDescription("Carrega a playlist de uma url")
    .addStringOption((option) => option.setName("url").setDescription("url da playlist").setRequired(true)))
  .addSubcommand((subcommand) => 
    subcommand
    .setName("search")
    .setDescription("Busca a musica baseado no digitado")
    .addStringOption((option) => option.setName("searchterms").setDescription("palavra pesquisadas").setRequired(true))),
//===============================================
  run: async({client, interaction}) => {
    if(!interaction.member.voice.channel)
      return interaction.editReply("Entra no voice ai burro")
    const queue = client.player.createQueue(interaction.guild);
    if(!queue.conection) await queue.connect(interaction.member.voice.channel)
    let embed = new MessageEmbed()
    if(interaction.options.getSubcommand() === "song"){
      let url = interaction.options.getString("url");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO
      })
      if(result.tracks.length === 0)
        return interaction.editReply("Nada encontrado")
      const song = result.tracks[0]
      await queue.addTrack(song)
      embed
      .setDescription(`**[${song.title}](${song.url})** foi adicionado a fila`)
      .setThumbnail(song.setThumbnail)
      .setFooter({text: `Duração: ${song.duration}`})
    }
//=================================================
    else if(interaction.options.getSubcommand() === "playlist"){
      let url = interaction.options.getString("url");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
        searchEngine: QueryType.SPOTIFY_PLAYLIST,
      })
      if(result.tracks.length === 0)
        return interaction.editReply("Nada encontrado")
      const playlist = result.playlist
      await queue.addTracks(result.tracks)
      embed
      .setDescription(`**${result.tracks.length} musicas de [${playlist.title}](${playlist.url})** foram adicionadas a fila`)
      .setThumbnail(playlist.setThumbnail)
    }
//================================================
    else if(interaction.options.getSubcommand() === "search"){
      let url = interaction.options.getString("searchterms");
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO
      })
      if(result.tracks.length === 0)
        return interaction.editReply("Nada encontrado")
      const song = result.tracks[0]
      await queue.addTrack(song)
      embed
      .setDescription(`**[${song.title}](${song.url})** foi adicionado a fila`)
      .setThumbnail(song.setThumbnail)
      .setFooter({text: `Duração: ${song.duration}`})
    }
    if(!queue.playing) await queue.play()
    await interaction.editReply({
      embeds: [embed]
    })
  }
}