const Input = require("../../InputEmitter"),
      path  = require("path"),
      fs    = require("fs");




Input.on("__set_uri", ({ option, values }) => {
    // if(!values[1]) return console.log("URI must be passed");
    
    fs.readFile(path.resolve(__rootDir, ".monghoul", "monghoul.config.json"), "utf8", (err, data) => {
        if(err) return console.log(err);
        const monghoulJsPath = path.resolve(__rootDir, ".monghoul", "monghoul.config.js");
        const monghoulJsonPath = path.resolve(__rootDir, ".monghoul", "monghoul.config.json");
        let config = null;
        let configJSON = null;

        try {
            config = JSON.parse(data);
            config.uri = values[1];
            configJSON = JSON.stringify(config, null, 2);
        } catch(err) {
            return console.log("ERROR: JSON In monghoul.config.json file has been corrupted");
        }

        fs.writeFile(monghoulJsonPath, configJSON, (err) => {
            if(err) return console.log("ERROR: Monghoul.config.json was not found");
            else {
                console.log("\n================================================================================")
                
                config.uri === ""
                ? console.log(`Setting URI to ${newURI}`)
                : console.log(`Changing MongoDB URI to ${config.uri}`);

                console.log("UPDATED: ./.monghoul/monghoul.config.json");

                fs.writeFile(monghoulJsPath, `module.exports = ${configJSON}`, (err) => {
                    if(err) return console.log("ERROR: Monghoul.config.js was not found");
                    else {
                        console.log("UPDATED: ./.monghoul/monghoul.config.js");
                        console.log("================================================================================")
                    }
                });
            }
        });
    });
});