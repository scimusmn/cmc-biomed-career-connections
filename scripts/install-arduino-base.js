const { execSync } = require('child_process');
const fs = require('fs');
const { exit } = require('process');

// Setup dir structure and install submodule for arduino-base if it does not exist
if (!fs.existsSync('src/Arduino')) {
  execSync('cd src && mkdir -p Arduino');
  execSync('cd src/Arduino && git submodule add https://github.com/scimusmn/arduino-base');
} else {
  console.warn('Arduino directory already exists. Skipping submodule installation.');
  console.warn('If you want a fresh re-install, delete the Arduino directory and run this script again.');
  exit(1);
}

// Get the latest submodule reference
execSync('git submodule update --init');

// Install/update arduino-base ReactSerial library dependencies in our root package.json
// TODO: we should attempt to remove this dependecies to make the frontend more portable
execSync('yarn add react-scrollable-list');
execSync('yarn add reactstrap');

// Copy wrapper page into Gatsby pages directory
execSync('cp src/Arduino/arduino-base/ReactSerial/examples/gatsby/gatsby-wrapper-page.js src/pages/arduino.js');

// Customize Gatsby's default html.js to create ipcRenderer reference.
if (!fs.existsSync('src/html.js')) {
  // Build site to generate .cache directory
  if (!fs.existsSync('.cache')) {
    execSync('yarn build');
  }

  // Inject script into customized html.js
  execSync('sed "s^</body>^  <script dangerouslySetInnerHTML={{ __html: \\`if (typeof require !== \'undefined\') window.ipcRef = require(\'electron\').ipcRenderer;\\` }} />\\\n</body>^" .cache/default-html.js > src/html.js');
}
