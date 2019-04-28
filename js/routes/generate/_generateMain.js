const Input = require("../../InputEmitter");
require("./_generateCollection");

const handleGenerate = (args) => {
    switch(args.values[0]){
        case("collection"): 
        case("Collection"):
        case("COLLECTION"):
            Input.emit("__create_collection", args);
        break;
        default:
            throw new Warning(`${args.values[0]} is not a valid item to generate`);
    }
}


Input.on("generate", handleGenerate);
Input.on("g", handleGenerate);