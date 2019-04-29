const input = require("../../InputEmitter"),
      fs    = require("fs");
      path  = require("path");

const monghoulConfigData = 
`const path = require("path");

module.exports = {
    rootDirectory: path.resolve(__dirname, "../"),
};
`;

const createDbDir = (rootDirectory) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(path.resolve(rootDirectory, "db", "migrations"), {recursive: true}, (err) => {
            if(err) reject(err);

            fs.writeFile(path.resolve(rootDirectory, "db", "schema.json"), "[]", (err) => {
                if(err) reject(err);

                fs.writeFile(path.resolve(rootDirectory, "db", "seeds.js"), "///// SEEDS FILE /////", (err) => {
                    if(err) reject(err);
                    else resolve("success");
                });
            });
        });
    });
};

const createCollectionsDir = (rootDirectory) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(path.resolve(rootDirectory, "collections"), (err) => {
            if(err) reject(err);
            else{
                resolve("success");
            }
        });
    });
};

const createMonghoulDir = (rootDirectory) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(path.resolve(rootDirectory, ".monghoul"), (err) => {
            if(err) reject(err);

            fs.mkdir(path.resolve(rootDirectory, ".monghoul", "schema-versions"), (err) => {
                if(err) reject(err);
                
                fs.writeFile(path.resolve(rootDirectory, ".monghoul", "monghoul.config.js"), monghoulConfigData, (err) => {
                    if(err) reject(err);
                    else resolve("success");
                });
            });
        });
    });
};



const handleInit = ({ option, values }) => {
    createDbDir(__rootDir)
    .then((res) => {
        return createCollectionsDir(__rootDir);
    })
    .then((res) => {
        return createMonghoulDir(__rootDir);
    })
    .catch((err) => console.log(err));
};


input.on("init", handleInit);