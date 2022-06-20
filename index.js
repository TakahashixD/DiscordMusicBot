const Discord = require("discord.js");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const fs = require("fs");
const {Player} = require("discord-player");
const configs = require("./config.json");
const express = require('express');
const server = express();

server.all('/', (req, res)=>{
    res.send('Your bot is alive!');
});
function keepAlive(){
    server.listen(3000, ()=>{console.log("Server is Ready!")});
}

const LOAD_SLASH = process.argv[2] == "load";

const CLIENT_ID = "987348452671381584"
const GUILD_ID= "207254450832801794"

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES","GUILD_VOICE_STATES"] });


client.slashcommands = new Discord.Collection();
client.player = new Player(client,{
  ytdlOptions:{
    quality: "highestaudio",
    highWaterMark: 1 << 25
  }
})
let commands = []

const slashFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for(const file of slashFiles){
  const slashcmd = require(`./commands/${file}`);
  client.slashcommands.set(slashcmd.data.name, slashcmd);
  if(LOAD_SLASH) commands.push(slashcmd.data.toJSON());
}
if(LOAD_SLASH){
  const rest =  new REST({version: "9"}).setToken(process.env['TOKEN']);
  console.log("Deploying slash commands");
  rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),{body: commands}).then(()=>{
    console.log("Sucessfully loaded");
    process.exit(0);
  }).catch((err) => {
    if(err){
      console.log(err);
      process.exit(1);
    }
  });
}
else{
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`)
    client.user.setActivity("Meu pau na sua mão"); 
  })
  client.on("interactionCreate", async (interaction) => {
      if(!interaction.isCommand()) return;
      const slashcmd = client.slashcommands.get(interaction.commandName);
      if(!slashcmd) interaction.reply("Not valid slash command");
      await interaction.deferReply();
      await slashcmd.run({client, interaction});
  })
keepAlive();
client.login(process.env['TOKEN']);
}