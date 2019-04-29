const Input = require("../../InputEmitter");
require("./_generateModel");

const handleGenerate = (args) => {
    switch(args.values[0].toLowerCase()){
        case("model"): 
            Input.emit("__generate_model", args);
        break;
        default:
            throw new Warning(`${args.values[0]} is not a valid item to generate`);
    }
}


Input.on("generate", handleGenerate);
Input.on("g", handleGenerate);