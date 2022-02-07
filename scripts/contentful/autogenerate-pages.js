require('dotenv').config({
  path: '.env.development',
});

// We only run and install this script after the optional contentful packages
// are installed by install-contentful. Tell eslint to be silent about this unresolved module.
// eslint-disable-next-line import/no-unresolved
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

  if (contentTypes.length === 0) {
    console.log(chalk.yellow('Warning - No content types exist in your Space. Exiting...'));
    process.exit(1);
  }

  const contentTypeConfigs = contentTypes.map((contentType) => ({
    name: contentType.name,
    id: contentType.sys.id,
    displayField: contentType.displayField,
    description: contentType.description,
    templateName: `${capitalizeFirstLetter(contentType.sys.id)}`,
    querySingle: `contentful${capitalizeFirstLetter(contentType.sys.id)}`,
    queryAll: `allContentful${capitalizeFirstLetter(contentType.sys.id)}`,
  }));

  console.log('\nWhich content type should be used to autogenerate pages? Available content types:');

  let typesStr = '';
  contentTypeConfigs.forEach((contentType) => {
    typesStr += `${chalk.blue(contentType.id)}\t`;
  });
  console.log(`${chalk.blue(typesStr)}`);

  rl.question('Enter content type id: ', (answer) => {
    if (answer === '') {
      console.log('\nNo content types selected. Exiting...');
      process.exit(1);
    }

    const selectedConfig = contentTypeConfigs.find((config) => config.id === answer);

    if (!selectedConfig) {
      console.log(chalk.red(`Content type "${answer}" not found`));
      process.exit(1);
      return;
    }

    console.log(chalk.green(`Creating template for ${selectedConfig.templateName}...`));

    // Create templates for each content type
    execSync('mkdir -p ./src/templates');

    console.log(`Template folder: ${chalk.green(selectedConfig.templateName)}`);

    // Create new template folder
    execSync(`mkdir -p ./src/templates/${selectedConfig.templateName}`);

    console.log(`Template index: ${chalk.green(`./src/templates/${selectedConfig.templateName}/index.js`)}`);

    // Copy boilerplate template into new template folder
    execSync(`cp -f ./scripts/contentful/config-files/contentful-template-boilerplate.js ./src/templates/${selectedConfig.templateName}/index.js`);

    // Replace placeholders in template page
    execSync(`sed -i '' "s/MyContentType/${selectedConfig.templateName}/g" ./src/templates/${selectedConfig.templateName}/index.js`);

    console.log(chalk.green('Writing to gatsby-node.js...'));

    // Copy boilerplate gatsby-node.js
    execSync('cp -f ./scripts/contentful/config-files/contentful-gatsby-node.js ./gatsby-node.js');

    // Replace placeholders in gatsby-node.js
    execSync(`sed -i '' "s/MyContentType/${selectedConfig.templateName}/g" ./gatsby-node.js`);

    console.log(chalk.green('Done!'));
    console.log(chalk.white(`Pages will now be generated for every record of type ${chalk.green(selectedConfig.id)}.\nTo confirm, run ${chalk.green('yarn develop')} and go to ${chalk.green('http://localhost:3000/x/')}. On the dev 404 page, you can view a list of all pages.`));

    process.exit(0);
  });
};

selectContentTypes();
