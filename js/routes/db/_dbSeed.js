const Input        = require("../../InputEmitter");
const execFile     = require("child_process").execFile;
const path         = require("path");


Input.on("db:seed", ({option, values}) => {
    const seedPath = path.resolve(__rootDir, "db", "seeds.js");
    execFile(seedPath, {}, (err, stdout, stderr) => {
        if(err) console.log(err);
        if(stdout) console.log(stdout);
        if(stderr) console.log(stderr);
    });
});