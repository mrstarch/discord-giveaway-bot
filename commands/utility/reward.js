const { SlashCommandBuilder } = require('discord.js');
const { rewardsFile } = require('../../config.js');
const {
  readJsonFileToMap,
  writeMapToJsonFile,
} = require('../../src/file-operations.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reward')
    .setDescription('Reward management of giveaway!')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Add new Reward to giveawawy')
        .addStringOption((option) =>
          option
            .setName('rewardname')
            .setDescription('Reward name')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('rewardtier')
            .setDescription('Reward Tier')
            .setRequired(true)
            .addChoices(
              { name: 'Bronze', value: 'Bronze' },
              { name: 'Silver', value: 'Silver' },
              { name: 'Gold', value: 'Gold' },
              { name: 'Platinum', value: 'Platinum' }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove Reward from giveawawy')
        .addStringOption((option) =>
          option
            .setName('rewardname')
            .setDescription('Reward name')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('rewardtier')
            .setDescription('Reward Tier')
            .setRequired(true)
            .addChoices(
              { name: 'Bronze', value: 'Bronze' },
              { name: 'Silver', value: 'Silver' },
              { name: 'Gold', value: 'Gold' },
              { name: 'Platinum', value: 'Platinum' }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('List all Reward')
        .addStringOption((option) =>
          option
            .setName('rewardtier')
            .setDescription('Reward Tier')
            .addChoices(
              { name: 'Bronze', value: 'Bronze' },
              { name: 'Silver', value: 'Silver' },
              { name: 'Gold', value: 'Gold' },
              { name: 'Platinum', value: 'Platinum' }
            )
        )
    ),

  async execute(interaction) {
    let reply = '';
    if (interaction.options.getSubcommand() === 'add') {
      const rewardName = interaction.options.getString('rewardname');
      const rewardTier = interaction.options.getString('rewardtier');
      reply = addReward(rewardName, rewardTier);
    } else if (interaction.options.getSubcommand() === 'remove') {
      const rewardName = interaction.options.getString('rewardname');
      const rewardTier = interaction.options.getString('rewardtier');
      reply = removeReward(rewardName, rewardTier);
    } else if (interaction.options.getSubcommand() === 'list') {
      const rewardTier = interaction.options.getString('rewardtier');
      reply = listRewards(rewardTier);
    }
    const rewardName = interaction.options.getString('rewardname');
    await interaction.reply({ content: reply, ephemeral: true });
  },
};

function addReward(rewardName, rewardTier) {
  try {
    let rewardsMap = readJsonFileToMap(rewardsFile);
    let rewardTierArray = rewardsMap.get(rewardTier)['Items'];
    rewardTierArray.push(rewardName);
    writeMapToJsonFile(rewardsMap, rewardsFile);
    return `Added reward ${rewardName} to ${rewardTier} Tier`;
  } catch (error) {
    console.error(error);
  }
}

function removeReward(rewardName, rewardTier) {
  try {
    let rewardsMap = readJsonFileToMap(rewardsFile);
    let rewardTierArray = rewardsMap.get(rewardTier)['Items'];
    if (rewardTierArray.includes(rewardName)) {
      let index = rewardTierArray.indexOf(rewardName);
      rewardTierArray.splice(index);
      writeMapToJsonFile(rewardsMap, rewardsFile);
      return `Removed reward ${rewardName} from ${rewardTier} Tier`;
    } else {
      return `The reward ${rewardName} is not in ${rewardTier} Tier`;
    }
  } catch (error) {
    console.error(error);
  }
}

function listRewards(rewardTier) {
  try {
    let rewardsMap = readJsonFileToMap(rewardsFile);
    let message = '';
    if (rewardTier) {
      let rewardTierArray = rewardsMap.get(rewardTier)['Items'];
      message += `Tier: ${rewardTier}\n`;
      if (rewardTierArray.length == 0) {
        return `${message}This tier has no rewards`;
      }
      rewardTierArray.forEach((reward, i) => {
        message += `${i + 1}. ${reward}\n`;
      });
      return message;
    } else {
      rewardsMap.forEach((value, tier) => {
        message += `Tier: ${tier}\n`;
        if (value['Items'].length == 0) {
          message += 'This tier has no rewards\n';
        } else {
          value['Items'].forEach((reward, i) => {
            message += `${i + 1}. ${reward}\n`;
          });
        }
        message += '\n';
      });
      return message;
    }
  } catch (error) {
    console.error(error);
  }
}
