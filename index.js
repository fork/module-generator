#!/usr/bin/env node

const chalk = require('chalk');
const promt = require('./lib/promt');
const createModule = require('./lib/createModule');

const init = async () => {
  try {
    const choices = await promt();
    await createModule(choices);

    console.log('Module successfully created!')
    if (choices.styles){
      console.warn(chalk.yellow('Remember to manually add the module`s stylesheet to your base stylesheet file.'));
    }
  } catch(error){
    console.log(chalk.red('Module generation failed!'));
    console.log(error);
  }
};

init();
