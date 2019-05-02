const Input       = require("../../InputEmitter"),
      fs          = require("fs"),
      path        = require("path"),
      readline    = require('readline'),
      ConfigUtils = require("../../utilities/config");

const seedsFile = 
`#!/usr/bin/env node

///// SEEDS FILE /////
const Monghoul = require("monghoul");
const config = require("../.monghoul/monghoul.config");

Monghoul.connect(config.uri).then(({client, db}) => {
// Write Seed Data Here //


















// Write Within Callback To End
// Monghoul.disconnect(config.uri);
})
.catch(console.log);
`;

const asyncSeedsFile = 
`#!/usr/bin/env node

///// SEEDS FILE /////
const Monghoul = require("monghoul");
const config = require("../.monghoul/monghoul.config");

(async function() {
    const {client, db} = await Monghoul.connect(config.uri);



















    Monghoul.disconnect(config.uri);
} () );`

const createDbDir = (rootDirectory, values) => {
    return new Promise((resolve, reject) => {
        console.log(values)
        let isAsyncSeeds = values.includes("--async-seeds", "--async-seed") 

        fs.mkdir(path.resolve(rootDirectory, "db", "migrations"), {recursive: true}, (err) => {
            if(err) reject(err);
            console.log("================================================================================");
            console.log("CREATED: ./db");
            console.log("CREATED: ./db/migrations");
            
            fs.writeFile(path.resolve(rootDirectory, "db", "schema.json"), "[]", (err) => {
                if(err) reject(err);
                console.log("CREATED: ./db/schema.json");
                
                fs.writeFile(path.resolve(rootDirectory, "db", "seeds.js"), isAsyncSeeds? asyncSeedsFile : seedsFile , { mode: 0o755}, (err) => {
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

const createMonghoulDir = (rootDirectory, uri) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(path.resolve(rootDirectory, ".monghoul"), (err) => {
            if(err) reject(err);
            console.log("CREATED: ./.monghoul");
            
            ConfigUtils.writeInitialConfigFile(JSON.stringify({uri}), (err) => {
                if(err) reject(err);
                console.log("CREATED: ./.monghoul/monghoul.config.js");

                console.log("================================================================================");
                resolve("success");
            });
        });
    });
};



const handleInit = ({ option, values }) => {
    if(__rootDir === process.cwd()) return console.log("Monghoul Already Initialized In Current Directory");
    const rootDirectory = process.cwd();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Set MongoDbURI: ', (mongodbUri) => {
      
        createDbDir(rootDirectory, values)
        .then((res) => {
            return createCollectionsDir(rootDirectory);
        })
        .then((res) => {
            return createMonghoulDir(rootDirectory, mongodbUri);
        })
        .catch((err) => console.log(err));

        rl.close();
    });
};


Input.on("init", handleInit);