require('dotenv').config({
  path: '.env.development',
});

const contentful = require('contentful-management');
const chalk = require('chalk');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('close', () => {
  console.log('\nBye bye!');
  process.exit(1);
});

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
});

const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const selectContentTypes = async () => {
  const contentTypes = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
    .then((space) => space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT))
    .then((environment) => environment.getContentTypes())
    .then((response) => response.items)
    .catch(console.error);

  const contentTypeConfigs = contentTypes.map((contentType) => ({
    name: contentType.name,
    id: contentType.sys.id,
    displayField: contentType.displayField,
    description: contentType.description,
    templateName: `${capitalizeFirstLetter(contentType.sys.id)}`,
    querySingle: `contentful${capitalizeFirstLetter(contentType.sys.id)}`,
    queryAll: `allContentful${capitalizeFirstLetter(contentType.sys.id)}`,
  }));

  console.log('\nWhich content type(s) should autogenerate pages? Available content types:');

  let typesStr = '';
  contentTypeConfigs.forEach((contentType) => {
    typesStr += `${chalk.blue(contentType.id)}\t`;
  });
  console.log(`${chalk.blue(typesStr)}`);

  rl.question('Enter their ids, separated by spaces: ', (answer) => {
    if (answer === '') {
      console.log('\nNo content types selected. Exiting...');
      process.exit(1);
    }
    console.log(chalk.green('Creating templates...'));

    const selectedContentTypes = answer.split(' ');

    // Create templates for each content type
    execSync('mkdir -p ./src/templates');

    selectedContentTypes.forEach((selectedTypeId) => {
      const contentTypeConfig = contentTypeConfigs.find((config) => config.id === selectedTypeId);
      if (!contentTypeConfig) {
        console.log(chalk.red(`Content type "${selectedTypeId}" not found`));
        process.exit(1);
        return;
      }
      // Create new template folder
      execSync(`mkdir -p ./src/templates/${contentTypeConfig.templateName}`);

      // Copy boilerplate template into new template folder
      execSync(`cp -f ./scripts/contentful/config-files/contentful-template-boilerplate.js ./src/templates/${contentTypeConfig.templateName}/index.js`);

      // Replace placeholders in template page
      execSync(`sed -i '' "s/MyContentType/${contentTypeConfig.templateName}/g" ./src/templates/${contentTypeConfig.templateName}/index.js`);

      console.log(chalk.green('Done!'));
      process.exit(0);
    });
  });
};

selectContentTypes();
