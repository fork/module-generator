'use strict';

const path = require('path');
const { promisify } = require('util');
const mkdirp = require('mkdirp');
const mkdirAsync = promisify(mkdirp);
const { writeFile } = require('fs');
const writeFileAsync = promisify(writeFile);
const nunjucks = require('nunjucks');

const nunjucksEnv = nunjucks.configure({
  autoescape: false,
  noCache: true
});

/**
 * Simple function to promisify nunjucks render function 
 *
 * @param {*} template Template path
 * @param {*} context Template Context
 * @returns {Promise}
 */
const renderAsync = (template, context) => {
  return new Promise((resolve, reject) => {
    nunjucksEnv.render(template, context, (error, result) => 
      error ? reject(error) : resolve (result)
    );
  })
}

/**
 * Renders
 * @param {String} templatePath Path to template file
 * @param {Object} context Data for the template to render
 * @param {String} ouputPath Path of the output file
 * @returns {Promise} Promise object that resolves if file was successfully rendered
 */
const renderToFile = ({ templatePath, context, outputPath }) => {
  // First create directory
  return mkdirAsync(path.dirname(outputPath))
    .then(() => {
      // Then render corresponding template
      return renderAsync(templatePath, context);
    })
    .then((fileContent) => {
      // Finally write result of rendering to file
      return writeFileAsync(outputPath, fileContent);
    })
};

module.exports = renderToFile;