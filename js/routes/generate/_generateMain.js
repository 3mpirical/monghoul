const Input = require("../../InputEmitter");
require("./_generateModel");
require("./_generateMigration");

const handleGenerate = (args) => {
    switch(args.values[0].toLowerCase()){
        case("model"): 
            Input.emit("__generate_model", args);
            break;
        case("migration"):
            Input.emit("__generate_migration", args);
        break;
        default:
            throw new Warning(`${args.values[0]} is not a valid item to generate`);
    }
}


Input.on("generate", handleGenerate);
Input.on("g", handleGenerate);