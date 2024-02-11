const { Events } = require('discord.js');
const {
  checkVoiceUsersActivityFile,
  readJsonFileToMap,
} = require('../src/file-operations.js');
const {
  startTimeTrackingForUser,
  endTimeTrackingForUser,
} = require('../src/voice-time-tracking.js');
const { voiceUsersActivityFile } = require('../config.js');

//Voice events when something happens in a voice channel
module.exports = {
  name: Events.VoiceStateUpdate,
  execute(oldState, newState) {
    checkVoiceUsersActivityFile();

    //Get all users that have been tracked before
    let activeUsersMap = readJsonFileToMap(voiceUsersActivityFile);

    let joinedUser = oldState.member;
    let newUserChannel = newState.channel;
    let oldUserChannel = oldState.channel;

    //Muted or deafened or so we are not starting to count
    if (newState.selfMute || newState.selfDeaf) {
      endTimeTrackingForUser(activeUsersMap, joinedUser);
      return;
    }
    //Unmuted or undefeaned so we start counting again
    else if (
      (oldState.selfMute && !newState.selfMute) ||
      (oldState.selfDeaf && !newState.selfDeaf)
    ) {
      startTimeTrackingForUser(activeUsersMap, joinedUser);
    }

    //User Join a voice channel
    if (oldUserChannel === null && newUserChannel !== null) {
      startTimeTrackingForUser(activeUsersMap, joinedUser);
    }
    //User Leave a voice channel
    else if (oldUserChannel !== null && newUserChannel === null) {
      endTimeTrackingForUser(activeUsersMap, joinedUser);
    }
  },
};
