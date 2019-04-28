const EventEmitter = require("events");


class InputEmitter extends EventEmitter{
    emitArgv(argv) {
        if(!Array.isArray(argv)) {
            throw new Error("Input Event Emitter must be passed argument vector array");
        }

        const option = argv[2];
        const values = argv.slice(3);

        this.emit(option, { option, values });
    }

    listen(event, callback) {
        this.on(event, callback);
    }
}

const Input = new InputEmitter;
module.exports = Input;
