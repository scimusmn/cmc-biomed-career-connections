const { execSync } = require('child_process');
const fs = require('fs');

// Setup dir structure and install submodule for arduino-base if it does not exist
if (!fs.existsSync('src/Arduino/arduino-base/ReactSerial')) {
  execSync('cd src && mkdir -p Arduino');
  execSync('cd src/Arduino && git submodule add https://github.com/scimusmn/arduino-base');
}

// Get the latest submodule reference
execSync('git submodule update --init');

// Install/update arduino-base ReactSerial library dependencies
execSync('cd src/Arduino/arduino-base/ReactSerial && yarn');
