const { execSync } = require('child_process');
const fs = require('fs');

// If arduino-base is installed as a submodule
// we need to install the ReactSerial library dependencies

// Check if arduino-base exists and install the dependencies for it if it does
if (fs.existsSync('src/Arduino/arduino-base/ReactSerial')) {
  execSync('cd src/Arduino/arduino-base/ReactSerial && yarn');
}
