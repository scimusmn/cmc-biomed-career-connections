const { execSync } = require('child_process');
const fs = require('fs');

// Setup dir structure and install submodule for arduino-base if it does not exist
if (fs.existsSync('src/Arduino/arduino-base/ReactSerial')) {
  execSync('cd src && mkdir Arduino');
  execSync('cd src/Arduino && git submodule add https://github.com/scimusmn/arduino-base');
}

// Get the latest submodule reference
execSync('git submodule update --init');
