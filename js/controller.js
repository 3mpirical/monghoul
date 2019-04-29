#!/usr/bin/env node

const findParentDir = require("find-parent-dir");
const Input = require("./InputEmitter");
require("./routes/mainRoutes.js");

///// Main Application Controller /////
const CTRL = (function(Input) {

    const emitInput = () => {
        // Sets root directory of project to the first directory where .monghoul is installed
        findParentDir(process.cwd(), '.monghoul', (err, dir)  => {
            if(err || dir === null) global.__rootDir = false;
            else global.__rootDir = dir;

            Input.emitArgv(process.argv);
        });
    };

    return {
        emitInput,
    };
} (Input) );

CTRL.emitInput();
