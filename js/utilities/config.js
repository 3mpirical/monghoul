const fs    = require("fs");
const path = require("path");


const writeInitialConfigFile = (json, callback) => {
    const configData = (
`module.exports = ${json};
`);

    fs.writeFile(path.resolve(process.cwd(), ".monghoul", "monghoul.config.js"), configData, callback);
};

const writeConfigFile = (json, callback) => {
    const configData = (
`module.exports = ${json};
`);

    fs.writeFile(path.resolve(__rootDir, ".monghoul", "monghoul.config.js"), configData, callback);
};

const requireConfigFile = () => {
    if(!__rootDir) return console.log("ERROR: No Root Directory Found");
    return require(path.resolve(__rootDir, ".monghoul", "monghoul.config.js"));
};

module.exports = {
    writeInitialConfigFile,
    writeConfigFile,
    requireConfigFile,
};