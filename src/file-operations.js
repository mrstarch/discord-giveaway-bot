const fs = require('node:fs');
const {
  dataFolder,
  voiceUsersActivityFile,
  rewardsFile,
  giveawayHostsFile,
} = require('../config.js');

// Read/Write maps from/to json
function readJsonFileToMap(filePath) {
  let jsonObj = readJsonFile(filePath);
  let mapObj = new Map(jsonObj);
  return mapObj;
}

function writeMapToJsonFile(mapObj, filePath) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(Array.from(mapObj.entries())),
    'utf-8'
  );
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJsonFile(obj, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(obj), 'utf-8');
}

function checkAllJSONFiles() {
  checkDataFolder();
  checkVoiceUsersActivityFile();
  checkRewardFile();
  checkGiveawayHostsFile();
}

function checkDataFolder() {
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
  }
}

//If file does not exist create and write empty []
function checkVoiceUsersActivityFile() {
  if (
    !fs.existsSync(voiceUsersActivityFile) ||
    (fs.existsSync(voiceUsersActivityFile) &&
      fs.readFileSync(voiceUsersActivityFile) == '')
  ) {
    fs.writeFileSync(voiceUsersActivityFile, JSON.stringify([]), 'utf-8');
  }
}

//If file does not exist create and write default json
function checkRewardFile() {
  const defaultRewardJson = [
    [
      'Bronze',
      {
        DropChance: 0.5,
        Items: [],
      },
    ],
    [
      'Silver',
      {
        DropChance: 0.3,
        Items: [],
      },
    ],
    [
      'Gold',
      {
        DropChance: 0.15,
        Items: [],
      },
    ],
    [
      'Platinum',
      {
        DropChance: 0.05,
        Items: [],
      },
    ],
  ];

  if (
    !fs.existsSync(rewardsFile) ||
    (fs.existsSync(rewardsFile) && fs.readFileSync(rewardsFile) == '')
  ) {
    fs.writeFileSync(rewardsFile, JSON.stringify(defaultRewardJson), 'utf-8');
  }
}

function checkGiveawayHostsFile() {
  const defaultHostsJson = {
    users: [],
    currentHostIndex: 0,
  };

  if (
    !fs.existsSync(giveawayHostsFile) ||
    (fs.existsSync(giveawayHostsFile) &&
      fs.readFileSync(giveawayHostsFile) == '')
  ) {
    fs.writeFileSync(
      giveawayHostsFile,
      JSON.stringify(defaultHostsJson),
      'utf-8'
    );
  }
}

module.exports = {
  readJsonFileToMap,
  writeMapToJsonFile,
  checkAllJSONFiles,
  checkVoiceUsersActivityFile,
  checkRewardFile,
  readJsonFile,
  writeJsonFile,
};
