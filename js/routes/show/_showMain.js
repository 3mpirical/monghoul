const Input = require("../../InputEmitter");
require("./_showMongoURI");

const handleShow = (args) => {
    switch(args.values[0]){
        case("uri"): 
        case("Uri"):
        case("URI"):
            Input.emit("__show_uri", args);
        break;
        default:
            throw new Warning(`${args.values[0]} is not a valid item to show`);
    }
}

Input.on("show", handleShow);