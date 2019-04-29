const Input = require("../../InputEmitter"),
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
            console.log("================================================================================")
            console.log("CREATED: ./db");
            console.log("CREATED: ./db/migrations");
            
            fs.writeFile(path.resolve(rootDirectory, "db", "schema.json"), "[]", (err) => {
                if(err) reject(err);
                console.log("CREATED: ./db/schema.json");
                
                fs.writeFile(path.resolve(rootDirectory, "db", "seeds.js"), "///// SEEDS FILE /////", (err) => {
                    if(err) reject(err);
                    else {
                        console.log("CREATED: ./db/seeds.js");
                        resolve("success");
                    }
                });
            });
        });
    });
};

const createCollectionsDir = (rootDirectory) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(path.resolve(rootDirectory, "models"), (err) => {
            if(err) reject(err);
            else{
                console.log("CREATED: ./models");
                resolve("success");
            }
        });
    });
};

const createMonghoulDir = (rootDirectory) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(path.resolve(rootDirectory, ".monghoul"), (err) => {
            if(err) reject(err);
            console.log("CREATED: ./.monghoul");
            
            fs.mkdir(path.resolve(rootDirectory, ".monghoul", "schema-versions"), (err) => {
                if(err) reject(err);
                console.log("CREATED: ./.monghoul/schema-versions");
                
                fs.writeFile(path.resolve(rootDirectory, ".monghoul", "monghoul.config.js"), monghoulConfigData, (err) => {
                    if(err) reject(err);
                    else {
                        console.log("CREATED: ./.monghoul/monghoul.config.js");
                        console.log("================================================================================")
                        resolve("success");
                    }
                });
            });
        });
    });
};



const handleInit = ({ option, values }) => {
    if(__rootDir === process.cwd()) return console.log("Monghoul Already Initialized In Current Directory");
    const rootDirectory = process.cwd()
    createDbDir(rootDirectory)
    .then((res) => {
        return createCollectionsDir(rootDirectory);
    })
    .then((res) => {
        return createMonghoulDir(rootDirectory);
    })
    .catch((err) => console.log(err));
};


Input.on("init", handleInit);