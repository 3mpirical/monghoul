const   MongoClient = require('mongodb').MongoClient,
        State = require("./js/state"),
        ModelUtils = require("./js/utilities/model");
        MigrationUtils = require("./js/utilities/migration");

module.exports = {

    Model: ModelUtils.Model,

    Migration: MigrationUtils.Migration,

    connect: State.connect,
    
    disconnect: State.disconnect,

};