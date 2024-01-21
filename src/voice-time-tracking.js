const {
    voiceUsersActivityFile
} = require('../config.js');

const {
    readJsonFileToMap,
    writeMapToJsonFile,
    checkVoiceUsersActivityFile
} = require('./file-operations.js');

//User joined vc and we need to start tracking time
function startTimeTrackingForUser(userMap, currentUser) {
    checkVoiceUsersActivityFile();
    let activeTime = 0;
    //If user has been in voicechat once this week grab the current active time
    if (userMap.has(currentUser.id)) {
        activeTime = userMap.get(currentUser.id).activeTime;
    }
    userMap.set(currentUser.id, { displayName: currentUser.displayName, activeTime: activeTime, startTime: new Date().getTime() });
    writeMapToJsonFile(userMap, voiceUsersActivityFile);
}

//A user has left the vc and we need to record time spend
function endTimeTrackingForUser(userMap, currentUser) {
    checkVoiceUsersActivityFile();
    let activeTime = 0;
    if (userMap.has(currentUser.id)) {
        activeTime = userMap.get(currentUser.id).activeTime;
        let startTime = userMap.get(currentUser.id).startTime;
        if (startTime == null) {
            // console.log(`Never started counting voice activity for user ${currentUser.displayName}`)
            return;
        }
        let timeSpentInVoice = new Date().getTime() - startTime;

        //Add time spend in vc to activeTime in milliseconds
        activeTime += timeSpentInVoice;

        userMap.set(currentUser.id, { displayName: currentUser.displayName, activeTime: activeTime });
        writeMapToJsonFile(userMap, voiceUsersActivityFile);
    }
}

//Start tracking for all users in all voice channels
function startTimeTrackingAll(voiceChannels) {
    checkVoiceUsersActivityFile();

    //Get all users that have been tracked before
    let userMap = readJsonFileToMap(voiceUsersActivityFile);

    Array.from(voiceChannels).forEach(vc => {
        let members = vc[1].members;
        //If no members in vc skip channel
        if (members.size == 0) {
            return;
        }

        members.filter(m => !m.voice.deaf && !m.voice.mute).forEach(m => {
            let activeTime = 0;
            if (userMap.has(m.id)) {
                activeTime = userMap.get(m.id).activeTime;
            }
            userMap.set(m.id, { displayName: m.displayName, activeTime: activeTime, startTime: new Date().getTime() });
        });
    });
    writeMapToJsonFile(userMap, voiceUsersActivityFile);
}

//Finish tracking for all users in all voice channels
function endTimeTrackingAll(voiceChannels) {
    checkVoiceUsersActivityFile();

    //Get all users that have been tracked before
    let userMap = readJsonFileToMap(voiceUsersActivityFile);

    Array.from(voiceChannels).forEach(vc => {
        let members = vc[1].members;
        //If no members in vc skip channel
        if (members.size == 0) {
            return;
        }
        //Go through all members
        members.filter(m => !m.voice.deaf && !m.voice.mute).forEach(m => {
            let activeTime = 0;
            if (userMap.has(m.id)) {
                let startTime = userMap.get(m.id).startTime;
                activeTime = userMap.get(m.id).activeTime;
                if (startTime == null) {
                    return;
                }
                let timeSpentInVoice = new Date().getTime() - startTime;

                //Add time spend in vc to activeTime in milliseconds
                activeTime += timeSpentInVoice;
            }
            userMap.set(m.id, { displayName: m.displayName, activeTime: activeTime });
        });
    });
    writeMapToJsonFile(userMap, voiceUsersActivityFile);
}

module.exports = {
    startTimeTrackingForUser,
    endTimeTrackingForUser,
    startTimeTrackingAll,
    endTimeTrackingAll,
}