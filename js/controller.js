#!/usr/bin/env node

const appRoot = require('app-root-path');

const Input = require("./InputEmitter");
require("./routes/mainRoutes.js");

///// Main Application Controller /////
const CTRL = (function(Input) {
    // Sets root directory of project installed within
    global.__rootDir = appRoot.path;


    const emitInput = () => {
        Input.emitArgv(process.argv);
    }

    return {
        emitInput,
    }
} (Input) );

CTRL.emitInput();
