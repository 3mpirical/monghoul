#!/usr/bin/env node

const Input = require("./InputEmitter");
require("./routes/mainRoutes.js");

///// Main Application Controller /////
const CTRL = (function(Input) {
    const emitInput = () => {
        Input.emitArgv(process.argv);
    }

    return {
        emitInput,
    }
} (Input) );

CTRL.emitInput();
