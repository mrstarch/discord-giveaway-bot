const path = require('node:path');
const { 
    Client, 
    GatewayIntentBits 
} = require('discord.js');
//Client setup
//Create a new client instance
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ] 
});

//Folder and file locations
const dataFolder =  path.join(__dirname, 'data');
const voiceUsersActivityFile = path.join(dataFolder, 'voiceUsersActivity.json');
const rewardsFile = path.join(dataFolder, 'rewards.json');
const giveawayHostsFile = path.join(dataFolder, 'giveawayHosts.json');

//Giveaway Settings
const minHoursInVoiceChannel = 15;

module.exports = {
    client,
    dataFolder,
    voiceUsersActivityFile,
    rewardsFile,
    minHoursInVoiceChannel,
    giveawayHostsFile
}