const Input          = require("../../InputEmitter"),
      ModelUtils     = require("../../utilities/model"),
      MigrationUtils = require("../../utilities/migration");

const { writeModelFile } = ModelUtils;

const handleGenerateModel = ({ option, values }) => {
    const name = values[1];
    if(!name) return console.log("ERROR: Models Must Have A Name");
    // 1) parse values
    const migrationArr = MigrationUtils.parseToMigrationArray(values.slice(2));
    MigrationUtils.writeCollectionMigrationFile(name, migrationArr);

    // ^^ use an object to map arguments passed to the values they should be in validator
    // ex const jsonSchema = { type: "bsonType" }; jsonSchema["type"];
    //                                                ^^ dynamically enter input to see if 
    //                                                   option exists, handle error if not.
    // * when vslue is found, have it be
    //   entered into 'writeMigrationFile' func
    //   where the jsonSchema can be created dynamically
    // 2) create model
    writeModelFile(name)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => console.log(err));
    // 3) create migration
};


Input.on("__generate_model", handleGenerateModel)