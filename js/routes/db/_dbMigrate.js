const Input = require("../../InputEmitter");
const path  = require("path");
const fs    = require("fs");

Input.on("db:migrate", ({option, values}) => {
    // <DONE> get a list of all migration files in migration directory
    // <DONE> read already ran migrations from migrations json config file
    // <DONE> filter migration list based on what has already been run in config
    // <DONE> reorder migrations based on their timestamp
    // execFileSync on migrations that haven't been run
    // when each migration is successfully ran, add that migration to the config json array and re-write config files and schema file;
    const pathToConfigJs = path.resolve(__rootDir, ".monghoul", "monghoul.config.js");
    const pathToMigrationsDir = path.resolve(__rootDir, "db", "migrations");

    const config = require(pathToConfigJs);
    const foundMigrations = fs.readdirSync(pathToMigrationsDir);
    if(!config.migrations) config.migrations = [];

    // filter foundMigrations so that only new migrations remain
    let newMigrations = foundMigrations.filter((migration) => {
        if(config.migrations.includes(migration)) return false;
        return true;
    });

    // sort new migrations by time created (so they are run in order)
    sortedNewMigrations = newMigrations.sort((a, b) =>{
        const aTime = parseInt( a.slice(0, a.indexOf("-")) );
        const bTime = parseInt( b.slice(0, b.indexOf("-")) );
        return  aTime - bTime; 
    });

    console.log(sortedNewMigrations);

});