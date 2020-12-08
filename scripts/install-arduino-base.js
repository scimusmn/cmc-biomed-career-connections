const { execSync } = require('child_process');
const fs = require('fs');

// Setup dir structure and install submodule for arduino-base if it does not exist
if (!fs.existsSync('src/Arduino')) {
  execSync('cd src && mkdir -p Arduino');
  execSync('cd src/Arduino && git submodule add https://github.com/scimusmn/arduino-base');
}

// Get the latest submodule reference
execSync('git submodule update --init');

// Install/update arduino-base ReactSerial library dependencies in our root package.json
// In the future, the list of deps might grow so we need to think about potential solutions for that
// But for now, we only need react-scrollable-list
execSync('yarn add react-scrollable-list');

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
