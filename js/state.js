const fs = require("fs");
const path = require("path");

const State = (function() {
    ///// STATE VARIABLES /////
    const UriHash = {};

    ///// GETTERS/SETTERS /////
    const addNewConnection = (mongodbUri, client, callback) => {
        if(UriHash[mongodbUri]) callback(`Error: ${mongodbUri} is already in use`);
        else {
            const db = client.db(client.s.options.dbName);
            UriHash[mongodbUri] = { client, db};
            db.on("close", () => {
                delete UriHash[mongodbUri];
            });
            callback(null);
        }
    }

    const disconnect = (mongodbUri) => {
        if(UriHash[mongodbUri]) {
            UriHash[mongodbUri].client.close();
            return "success";
        }
        return false;
    }

    const client = (mongodbUri) => UriHash[mongodbUri].client;

    const db = (mongodbUri) => UriHash[mongodbUri].db;

    return {
        addNewConnection,
        disconnect,

        client,
        db,
    };
} () );

module.exports = State;