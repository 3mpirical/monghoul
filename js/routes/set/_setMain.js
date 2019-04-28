const Input = require("../../InputEmitter");
require("./_setMongoURI");

const handleSet = (args) => {
    switch(args.values[0]){
        case("uri"): 
        case("Uri"):
        case("URI"):
            Input.emit("__set_uri", args);
        break;
        default:
            throw new Warning(`${args.values[0]} is not a valid item to set`);
    }
}


Input.on("set", handleSet);
Input.on("s", handleSet);