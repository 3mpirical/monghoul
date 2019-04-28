const input = require("../../InputEmitter"),
      fs    = require("fs");
      path  = require("path");

console.log(path.dirname(require.main.filename));
const rootDirectory = process.cwd();
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
    createDbDir(rootDirectory)
    .then((res) => {
        return createCollectionsDir(rootDirectory);
    })
    .then((res) => {
        return createMonghoulDir(rootDirectory);
    })
    .catch((err) => console.log(err));
};


input.on("init", handleInit);