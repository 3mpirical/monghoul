#!/usr/bin/env node

const execFile = require("child_process").execFile;
const ConfigUtils  = require("../../utilities/config");
const State        = require("../../state");
const Input        = require("../../InputEmitter");
const path         = require("path");
const fs           = require("fs");



const getSchema = (db) => {
    return new Promise((resolve, reject) => {
        db.collections((err, collections) => {
            if(err) reject(err);
            let schema = {};
            let count = 0;
            
            // get the schema of each collection recursively 
            // and construct the schema object from results
            getCollectionSchema = (collections) => {
                collections[count].options()
                .then((res) => {
                    let name = collections[count].s.name;
                    schema[name] = res;

                    count ++
                    if(count === collections.length) {
                        resolve( schema );
                    } else {
                        return getCollectionSchema(collections);
                    }
                })
                .catch((err) => reject(err));
            };

            getCollectionSchema(collections);
        });
    });
};



const recurseMigrate = (db, migrations) => {
    return new Promise((resolve, reject) => {

        let count = 0;
        const migrateHelper = () => {
            // execute the migration file
            const migrationPath = path.resolve(__rootDir, "db", "migrations", migrations[count]);
            execFile(migrationPath, {}, (err, stdout, stderr) => {
                if(err) reject(console.log("EXECUTION ERROR: ", err));
                if(stderr) reject(console.log("EXECUTION ERROR: ", stderr));
                if(stdout) console.log(stdout);
                let schema;
    
                // get the newly created schema after migration
                getSchema(db)
                .then((res) => {
                    schema = JSON.stringify(res, null, 4);
                    // insert the new migration record/schema into database
                    return db.collection("migrations").insertOne({
                        timestamp: parseInt( migrations[count].slice(0, migrations[count].indexOf("-")) ),
                        migration: migrations[count],
                        schema,
                    })
                    .then((res) =>{
                        const schemaFilePath = path.resolve(__rootDir, "db", "schema.json");
                        
                        // write the new schema.json file
                        fs.writeFile(schemaFilePath, schema, (err) => {
                            if(err) return reject(err);
                            console.log(`MIGRATED: ${migrations[count]}`);

                            count ++;
                            if(count !== migrations.length) {
                                return migrateHelper();
                            } else {
                                resolve("success");
                            }
                        });
                    })
                    .catch((err) => reject(err));
    
                })
                .catch((err) => reject(err));
            });  
        };

        migrateHelper();
    });
};


Input.on("db:migrate", ({option, values}) => {
    /////////////////////
    // 1) get list of already run migrations from database
    // 2) filter out already ran migrations
    // 3) when migration is being run, it must:
    //      - perform operation on the database via execFile
    //      - get new json schema
    //      - write new json schema file
    //      - save current jsonschema, migration file name, 
    //        and migration timestamp to the database.
    //      - output all of the actions being done
    const pathToMigrationsDir = path.resolve(__rootDir, "db", "migrations");
    const config = ConfigUtils.requireConfigFile();
    const foundMigrations = fs.readdirSync(pathToMigrationsDir);

    // connect to database and find ran migrations
    State.connect(config.uri)
    .then(({client, db}) => {
        db.collection("migrations").find().toArray((err, ranMigrations) => {
            if(err) return err;

            // Filter foundMigrations so that only new migrations remain.
            // The ranMigrationNames object is constructed so we can keep
            // this part of the algorithm linear time complexity. The 
            // alternative solution is to loop through ranMigrations for each
            // found migration (aka exponential time complexity);
            let newMigrations = [];
            let ranMigrationNames = {}; 
            ranMigrations.forEach((migration) => ranMigrationNames[migration.migration] = true);
            if(ranMigrations.length > 0) {
                foundMigrations.forEach((migration) => {
                    if(!ranMigrationNames[migration]) newMigrations.push(migration);
                });
            } else {
                newMigrations = foundMigrations;
            }
            
            // if there are no new migrations, stop execution
            if(newMigrations.length === 0) {
                State.disconnect(config.uri);
                return console.log("No New Migrations Found");
            }

            // sort new migrations by time created (so they are run in order)
            sortedNewMigrations = newMigrations.sort((a, b) =>{
                const aTime = parseInt( a.slice(0, a.indexOf("-")) );
                const bTime = parseInt( b.slice(0, b.indexOf("-")) );
                return  aTime - bTime;
            });
            
            console.log("\n================================================================================");
            
            recurseMigrate(db, sortedNewMigrations)
            .then((res) => {
                State.disconnect(config.uri);
                console.log("================================================================================\n");
            })
            .catch((err) => console.log(err));
        });
    })
    .catch((err) => console.log(err));

});