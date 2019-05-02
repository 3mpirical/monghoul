const Input          = require("../../InputEmitter"),
      MigrationUtils = require("../../utilities/migration");


const handleGenerateMigration = ({ option, values }) => {
    const name = values[1];
    if(!name) return console.log("ERROR: Migrations Must Have A Name");

    console.log("here");
    // 1) parse values
    // const migrationArr = MigrationUtils.parseToMigrationArray(values.slice(2));
    // *** We have to parse the name in order to write the migration file
    // Add Format: Add <property> To <collection>
    
    // AddValidation Format: AddValidation To <collection> 

    // Remove Format: Remove <property> From <collection>
    // ^^^ Removing properties will involve deleting all of them 
    //     and adding back the schema with the properties removed?
    // OR!!! ---> Do I just have to run collmod using the current schema,
    //            but with the properties/validation removed

    // RemoveValidation Format: RemoveValidation From <collection>

    console.log("\n================================================================================");

    // 2) create migration
    MigrationUtils.writeMigrationFile(name)
    .then((res) => {
        console.log("================================================================================\n");
    })
    .catch((err) => console.log(err));
};


Input.on("__generate_migration", handleGenerateMigration);