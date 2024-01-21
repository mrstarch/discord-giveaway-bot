const { Events } = require('discord.js');
const { checkAllJSONFiles } = require('../src/file-operations.js');
const { scheduleGiveawayDate } = require('../src/giveaway-event.js');
const { startTimeTrackingAll } = require('../src/voice-time-tracking.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		checkAllJSONFiles();
        console.log(`Ready! Logged in as ${client.user.tag}`);

        //Start cron job to run
        scheduleGiveawayDate();

        //Find all voice channels
        let voiceChannels = client.channels.cache.filter(vc => vc.type == 2);
        startTimeTrackingAll(voiceChannels);
	},
};