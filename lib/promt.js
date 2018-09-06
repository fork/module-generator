'use strict';
const inquirer = require('inquirer');

const config = require('../config');

const prompt = () =>
  inquirer.prompt([
    {
      type: 'input',
      name: 'moduleName',
      message: 'Enter module name',
      filter: value => value.replace(/[^a-z0-9-]+/gi, '-').toLowerCase(),
      // TODO: More sophisticated checks if module name is valid (not starting with a number, ...)
      validate: value => (value.trim().length <= 0 ? 'Invalid module name' : true)
    },
    {
      type: 'list',
      name: 'moduleHierarchy',
      message: 'Select module hierarchy',
      choices: config.hierarchy.map(type => type.name)
    },
    {
      type: 'confirm',
      name: 'js',
      message: 'Should module contain Javascript?'
    },
    {
      type: 'confirm',
      name: 'styles',
      message: 'Should module contain styles?'
    },
    {
      type: 'confirm',
      name: 'template',
      message: 'Should module contain Nunjucks-templates?'
    },
    {
      type: 'confirm',
      name: 'data',
      message: 'Should module contain a data file?'
    }
    // TODO: Check weather module should be displayed in styleguide
  ]);

module.exports = prompt;
