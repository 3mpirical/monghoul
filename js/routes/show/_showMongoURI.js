const Input = require("../../InputEmitter"),
      path  = require("path"),
      fs  = require("fs");



Input.on("__show_uri", ({option, values}) => {
    fs.readFile(path.resolve(__rootDir, ".monghoul", "monghoul.config.json"), "utf8", (err, data) => {
        if(err) return console.log("ERROR: Monghoul.config.json was not found");
        let config = null;

        try {
            config = JSON.parse(data);
        } catch(err) {
            return console.log("ERROR: JSON In monghoul.config.json file has been corrupted");
        }

        console.log(`Current URI: ${config.uri}`);
    });
})