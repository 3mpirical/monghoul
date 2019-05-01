const Input          = require("../../InputEmitter"),
      ModelUtils     = require("../../utilities/model"),
      MigrationUtils = require("../../utilities/migration");

const { writeModelFile } = ModelUtils;

const handleGenerateModel = ({ option, values }) => {
    const name = values[1];
    if(!name) return console.log("ERROR: Models Must Have A Name");

    // 1) parse values
    const migrationArr = MigrationUtils.parseToMigrationArray(values.slice(2));

    // 2) create migration
    MigrationUtils.writeCollectionMigrationFile(name, migrationArr);

    // 3) create model
    writeModelFile(name)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => console.log(err));
};


Input.on("__generate_model", handleGenerateModel);