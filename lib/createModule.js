const path = require('path');
const renderToFile = require('./renderToFile');
const find = require('lodash/find');

const config = require('../config.json');
const appDir = path.dirname(require.main.filename);

const templates = {
  javascriptBase:'/templates/javascript-base.njk',
  javascriptClass: '/templates/javascript-class.njk',
  stylesheet: '/templates/stylesheet.njk',
  template: '/templates/template.njk',
  data: '/templates/data.njk'
}

const getAbsolutTemplatePath = templatePath => path.join(appDir, templatePath);

const hyphenToCamelCase = text => text.replace(/-([a-z])/g, g => g[1].toUpperCase());

/**
 * Generates a new module based on the choices that a user made in the cli
 * @param {Object} choices Coices of the user
 * @param {String} choices.moduleName Name of the module
 * @param {boolean} choices.js Javascript files should be generated
 * @param {boolean} choices.styles Stylesheets files should be generated
 * @param {boolean} choices.template Template files should be generated
 * @param {boolean} choices.data Data files should be generated
 * @returns
 */
const createModule = async choices => {

  const files = [];

  const modulePath = path.join(
    config.paths.componentsDir,
    choices.moduleHierarchy,
    choices.moduleName
  );

  const modulePrefix = find(config.hierarchy, item => item.name === choices.moduleHierarchy).prefix;

  const camelCaseName = hyphenToCamelCase(choices.moduleName);

  const context = {
    name: {
      hyphens: choices.moduleName,
      hyphensPrefixed: `${modulePrefix}-${choices.moduleName}`,
      lowerCamelCase: camelCaseName,
      upperCamelCase: `${camelCaseName.charAt(0).toUpperCase()}${camelCaseName.slice(1)}`
    },
    hierarchy: choices.moduleHierarchy
  }

  if (choices.js) {
    const javascriptDir = path.join(modulePath, 'javascripts');
    context.relativeJsDir = path.relative(javascriptDir, config.paths.javascriptsDir);

    files.push({
      templatePath: getAbsolutTemplatePath(templates.javascriptBase),
      context,
      outputPath: path.join(javascriptDir, 'index.js')
    });

    files.push({
      templatePath:  getAbsolutTemplatePath(templates.javascriptClass),
      context,
      outputPath: path.join(javascriptDir, `${choices.moduleName}.js`)
    });
  }

  if (choices.styles){
    files.push({
      templatePath:  getAbsolutTemplatePath(templates.stylesheet),
      context,
      outputPath: path.join(modulePath, `_${choices.moduleName}.scss`)
    });
  }

  if (choices.data){
    files.push({
      templatePath:  getAbsolutTemplatePath(templates.data),
      context,
      outputPath: path.join(modulePath, 'data', '00-default.json')
    });
  }

  if (choices.template){
    files.push({
      templatePath:  getAbsolutTemplatePath(templates.template),
      context,
      outputPath: path.join(modulePath, `${choices.moduleName}.njk`)
    });
  }

  return Promise.all( files.map(file => renderToFile(file)) );
};

module.exports = createModule;