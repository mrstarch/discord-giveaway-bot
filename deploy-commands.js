import 'dotenv/config';
import { InstallGuildCommands } from './src/utility.js';

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND];

InstallGuildCommands(process.env.APP_ID, ALL_COMMANDS);