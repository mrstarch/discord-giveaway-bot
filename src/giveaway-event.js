const fs = require('node:fs');
const { client } = require('../config.js');
const { CronJob } = require('cron');
const {
  voiceUsersActivityFile,
  minHoursInVoiceChannel,
  giveawayHostsFile,
  rewardsFile,
} = require('../config.js');
const { readJsonFileToMap, checkRewardFile } = require('./file-operations.js');
const { randomInt } = require('crypto');

function scheduleGiveawayDate() {
  //Set job to be every friday at 18:00 'Europe/Berlin'
  let job = new CronJob(
    '0 18 * * 5', // cronTime
    createAndSendWinnerMessage, // onTick
    null, // onComplete
    true // start
  );
}

async function createAndSendWinnerMessage() {
  let winnerObj = chooseWinner();
  let hostId = chooseHost();
  let itemObj = chooseItem();

  if (!winnerObj || !hostId || !itemObj) {
    console.info('Either no host, no candidates, or prizes found');
    return;
  }

  let channel = client.channels.cache.get(giveawayManagerChannelId);
  let winnerUserName = (await client.users.fetch(winnerObj['userId']))
    .displayName;
  let hostUserName = (await client.users.fetch(hostId)).displayName;

  const message = new EmbedBuilder()
    .setTitle(`${itemObj['amount']}x ${itemObj['item']}`)
    .setDescription(`Rarity: ${itemObj['rarity']}`)
    .setColor('33dbc5')
    .addFields(
      {
        name: 'Gewinner',
        value: `${winnerUserName}`,
        inline: true,
      },
      {
        name: 'Host',
        value: `${hostUserName}`,
      }
    )
    .setThumbnail(`${itemObj['image']}`)
    .setTimestamp();

  channel.send(`Gewinner der Woche: ${userMention(winnerObj['userId'])}`);
  channel.send({ embeds: [message] });
}

function chooseWinner() {
  let userMap = readJsonFileToMap(voiceUsersActivityFile);
  let canditates = [];
  let minHours = minHoursInVoiceChannel;

  userMap.forEach((value, key) => {
    let hours = Math.floor(value.activeTime / (1000 * 60 * 60));
    if (hours >= minHours) {
      canditates.push({ userId: key, activeTime: value.activeTime });
    }
  });

  let userCount = canditates.length;
  if (userCount == 0) {
    console.info('No Canditates Found');
    return;
  }

  let winnerUserIndex = randomInt(0, userCount);
  let winner = canditates[winnerUserIndex];

  return winner;
}

function chooseHost() {
  let giveawayHostsData = JSON.parse(
    fs.readFileSync(giveawayHostsFile, 'utf8')
  );
  let hostUsers = giveawayHostsData['users'];

  if (hostUsers.length == 0) {
    console.info('No Hosts Found');
    return;
  }

  let currentHostIndex = giveawayHostsData['currentHostIndex'];

  if (hostUsers.length - 1 == currentHostIndex)
    giveawayHostsData['currentHostIndex'] = 0;
  else giveawayHostsData['currentHostIndex'] += 1;

  fs.writeFileSync(
    giveawayHostsFile,
    JSON.stringify(giveawayHostsData),
    'utf8'
  );

  return hostUsers[currentHostIndex];
}

function chooseItem() {
  checkRewardFile();
  const rewardMap = readJsonFileToMap(rewardsFile);
  const rolledNumRarity = Math.random();
  let winningRarity = '';
  // Determine the selected outcome based on probabilities
  let cumulativeProbability = 0;
  for (const [key, value] of rewardMap) {
    cumulativeProbability += value['DropChance'];
    if (rolledNumRarity <= cumulativeProbability) {
      winningRarity = key;
      break;
    }
  }

  const prizes = rewardMap.get(winningRarity)['Items'];
  let prizesCount = prizes.length;

  if (prizesCount == 0) {
    console.info('No Prizes Found');
    return;
  }
  const rolledNumItem = randomInt(0, prizesCount);

  return {
    rarity: winningRarity,
    item: prizes[rolledNumItem]['item'],
    amount: prizes[rolledNumItem]['amount'],
    image: prizes[rolledNumItem]['image'],
  };
}

module.exports = {
  scheduleGiveawayDate,
  chooseWinner,
  chooseHost,
  chooseItem,
};
