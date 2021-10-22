/* eslint no-console: 0 */

const chalk = require('chalk');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('close', () => {
  console.log('\nBye bye!');
  process.exit(1); // Exit without success
});

console.log(chalk.green('Configuring app-template for Contentful integration...'));

rl.question('What is the Contentful Space ID? ', (answerSpaceId) => {
  rl.question('What is the Content Delivery API - access token? ', (answerAccessToken) => {
    rl.question('What is the Content management - access token? ', (answerManagementToken) => {
      console.log('\nGot it! Does everything look correct?');
      const empty = '#####';
      const spaceId = answerSpaceId || empty;
      const accessToken = answerAccessToken || empty;
      const managementToken = answerManagementToken || empty;
      console.log(`CONTENTFUL_SPACE_ID=${chalk.green(spaceId)}`);
      console.log(`CONTENTFUL_ACCESS_TOKEN=${chalk.green(accessToken)}`);
      console.log(`CONTENTFUL_MANAGEMENT_TOKEN=${chalk.green(managementToken)}`);
      rl.question('[Y/N]? ', (answerYesNo) => {
        if (answerYesNo.toLowerCase().includes('y')) {
          console.log(chalk.green('Writing values to env files...'));

          // Write placeholder values to example env files
          execSync('echo "\n# Contentful integration" | tee -a env.development.example env.production.example');
          execSync(`echo "CONTENTFUL_SPACE_ID=${empty}" | tee -a env.development.example env.production.example`);
          execSync('echo "CONTENTFUL_ENVIRONMENT=master" | tee -a env.development.example env.production.example');
          execSync('echo "CONTENTFUL_HOST=cdn.contentful.com" | tee -a env.development.example env.production.example');
          execSync(`echo "CONTENTFUL_ACCESS_TOKEN=${empty}" | tee -a env.development.example env.production.example`);
          execSync(`echo "CONTENTFUL_MANAGEMENT_TOKEN=${empty}" | tee -a env.development.example env.production.example`);

          // Write real values to env files
          execSync('echo "\n# Contentful integration" | tee -a .env.development .env.production');
          execSync(`echo "CONTENTFUL_SPACE_ID=${spaceId}" | tee -a .env.development .env.production`);
          execSync('echo "CONTENTFUL_ENVIRONMENT=master" | tee -a .env.development .env.production');
          execSync('echo "CONTENTFUL_HOST=cdn.contentful.com" | tee -a .env.development .env.production');
          execSync(`echo "CONTENTFUL_ACCESS_TOKEN=${accessToken}" | tee -a .env.development .env.production`);
          execSync(`echo "CONTENTFUL_MANAGEMENT_TOKEN=${managementToken}" | tee -a .env.development .env.production`);
          console.log(chalk.green('Done!'));

          // Install dependencies
          console.log(chalk.green('Installing dependencies...'));
          execSync('yarn add gatsby-source-contentful');
          console.log(chalk.green('Done!'));

          console.log(chalk.green('Installing dev dependencies...'));
          execSync('yarn add --dev contentful-management');
          console.log(chalk.green('Done!'));

          // Write to gatsby-config.js
          console.log(chalk.green('Overwriting gatsby-config.js...'));
          execSync('cp -f ./scripts/contentful/config-files/contentful-gatsby-config.js ./gatsby-config.js');
          console.log(chalk.green('Done!'));

          process.exit(0); // Exit with success
        } else {
          console.log('\nOkay, please start over.');
          process.exit(1); // Exit without success
        }
      });
    });
  });
});
