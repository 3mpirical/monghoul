const Input       = require("../../InputEmitter"),
      path        = require("path"),
      fs          = require("fs"),
      ConfigUtils = require("../../utilities/config");

Input.on("__set_uri", ({ option, values }) => {
    if(!values[1]) return console.log("URI must be passed");
    
    const { requireConfigFile, writeConfigFile } = ConfigUtils;
    let config = requireConfigFile();

    config.uri = values[1];
    configJSON = JSON.stringify(config, null, 2);

    writeConfigFile(configJSON, (err) => {
        if(err) return console.log("ERROR: Monghoul.config.json was not found");
        console.log("\n================================================================================")
        console.log(`Setting MongoDB URI to ${config.uri}`);
        console.log("UPDATED: ./.monghoul/monghoul.config.js");
        console.log("================================================================================")
    });
});