const fs = require('fs');
const path = require('path');

// Load build names from config
let buildNames = {};
try {
  const namesConfig = fs.readFileSync(path.join(__dirname, 'build-names.json'), 'utf8');
  buildNames = JSON.parse(namesConfig);
} catch (err) {
  console.log('No build-names.json found or invalid format, using default names');
}

// Scan assets directory for build images
const assetsDir = path.join(__dirname, 'assets');
const files = fs.readdirSync(assetsDir);

// Find all build images and group by build number
const buildPattern = /^build(\d+)_(\d+)\.jpg$/;
const builds = {};

files.forEach(file => {
  const match = file.match(buildPattern);
  if (match) {
    const buildNum = match[1];
    const frameNum = parseInt(match[2]);
    const buildId = `build${buildNum}`;
    
    if (!builds[buildNum]) {
      builds[buildNum] = {
        id: buildId,
        // Use custom name from config if available, otherwise use default
        name: buildNames[buildId] || `Build ${buildNum}`,
        totalFrames: 0
      };
    }
    
    builds[buildNum].totalFrames = Math.max(builds[buildNum].totalFrames, frameNum);
  }
});

// Convert to array and write to builds.js
const config = Object.values(builds);
const jsContent = `window.BUILDS = ${JSON.stringify(config, null, 2)};`;

fs.writeFileSync(
  path.join(__dirname, 'assets', 'js', 'builds.js'),
  jsContent
);

console.log('Generated builds.js with:', config.length, 'builds');