const   Input = require("../../InputEmitter"),
        State = require("../../state");


Input.on("__set_uri", ({ option, values }) => {
    if(!values[1]) return console.log("URI must be passed");

    const newURI = values[1];
    const oldURI = State.getMongoURI();

    if(oldURI === "") {
        console.log(`Setting URI to ${newURI}`);
    } else {
        console.log(`Changing MongoDB URI from ${oldURI} to ${newURI}`);
    }

    State.setMongoURI(newURI);
})