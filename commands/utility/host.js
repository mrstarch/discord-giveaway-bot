const { SlashCommandBuilder } = require('discord.js');
const { giveawayHostsFile } = require('../../config.js');
const { readJsonFile, writeJsonFile } = require('../../src/file-operations.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('host')
    .setDescription('Host management of giveaway!')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Add new Host to giveawawy')
        .addUserOption((option) =>
          option.setName('user').setDescription('Host name').setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove Host from giveawawy')
        .addUserOption((option) =>
          option.setName('user').setDescription('Host name').setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('list').setDescription('List all Hosts')
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('currenthost').setDescription('Show the current Hosts')
    ),

  async execute(interaction) {
    let reply = '';
    if (interaction.options.getSubcommand() === 'add') {
      const user = interaction.options.getUser('user');
      reply = addHost(user);
    } else if (interaction.options.getSubcommand() === 'remove') {
      const user = interaction.options.getUser('user');
      reply = removeHost(user);
    } else if (interaction.options.getSubcommand() === 'list') {
      reply = listHost(interaction);
    } else if (interaction.options.getSubcommand() === 'currenthost') {
      reply = currentHost(interaction);
    }

    await interaction.reply({ content: reply, ephemeral: true });
  },
};

function addHost(user) {
  try {
    if (user) {
      let hosts = readJsonFile(giveawayHostsFile);
      if (!hosts['users'].includes(user.id)) {
        hosts['users'].push(user.id);
        writeJsonFile(hosts, giveawayHostsFile);
        return `Added user as a host to giveaway\nUsername: ${user.username}`;
      } else {
        return `The user is already a host\nUsername: ${user.username}`;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

function removeHost(user) {
  try {
    if (user) {
      let hosts = readJsonFile(giveawayHostsFile);
      if (hosts['users'].includes(user.id)) {
        let index = hosts['users'].indexOf(user.id);
        hosts['users'].splice(index);
        writeJsonFile(hosts, giveawayHostsFile);
        return `Removed user as a host from giveaway\nUsername: ${user.username}`;
      } else {
        return `The user is not a host\nUsername: ${user.username}`;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

function listHost(interaction) {
  let hosts = readJsonFile(giveawayHostsFile);
  let message = '';
  let count = 1;
  hosts['users'].forEach((userId) => {
    let user = interaction.guild.members.cache.get(userId);
    message += `${count}. ${user.user.username}\n`;
  });
  return message;
}

function currentHost(interaction) {
  let hosts = readJsonFile(giveawayHostsFile);
  let index = hosts['currentHostIndex'];
  let user = interaction.guild.members.cache.get(hosts['users'][index]);
  return `Current Host for next giveaway\nUsername: ${user.user.username}`;
}
