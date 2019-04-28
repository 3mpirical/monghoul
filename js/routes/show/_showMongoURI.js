const   Input = require("../../InputEmitter"),
        State = require("../../state.js");

Input.on("__show_uri", ({option, values}) => {
    console.log(`Current URI: ${State.getMongoURI()}`);
})