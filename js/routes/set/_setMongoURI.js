const Input = require("../../InputEmitter"),
      path  = require("path"),
      fs    = require("fs");




Input.on("__set_uri", ({ option, values }) => {
    if(!values[1]) return console.log("URI must be passed");
    
    fs.readFile(path.resolve(__rootDir, ".monghoul", "monghoul.config.json"), "utf8", (err, data) => {
        if(err) return console.log(err);
        const configArr = [];
        let config = null;

        try {
            config = JSON.parse(data);
            config.uri = values[1];
        } catch(err) {
            return console.log("ERROR: JSON In monghoul.config.json file has been corrupted");
        }


        // Creating confifArr to be displayed in module.exports
        for(let i in config) {
            if(typeof config[i] === "string") {
                configArr.push(`${i}: "${config[i]}",`);
            } else {
                configArr.push(`${i}: ${config[i]},`);
            }
        }

        const monghoulConfigString = 
`module.exports = {
    ${configArr}
}`;

        fs.writeFile(path.resolve(__rootDir, ".monghoul", "monghoul.config.json"), JSON.stringify(config), (err) => {
            if(err) return console.log("ERROR: Monghoul.config.json was not found");
            else {
                console.log("\n================================================================================")
                
                config.uri === ""
                ? console.log(`Setting URI to ${newURI}`)
                : console.log(`Changing MongoDB URI to ${config.uri}`);

                console.log("UPDATED: ./.monghoul/monghoul.config.json");

                fs.writeFile(path.resolve(__rootDir, ".monghoul", "monghoul.config.js"), monghoulConfigString, (err) => {
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