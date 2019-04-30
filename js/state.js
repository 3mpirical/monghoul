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
            // global[mongodbUri] = { client, db};
            // console.log(global)
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

    const client = (mongodbUri) => { if(UriHash[mongodbUri]) return UriHash[mongodbUri].client }

    const db = (mongodbUri, callback) => { 
        if(UriHash[mongodbUri]) callback(null, UriHash[mongodbUri].db);
        else {
            let count = 0;
            const reCheck = (function() {
                setTimeout(() => {
                    if(UriHash[mongodbUri]) callback(null, UriHash[mongodbUri].db);
                    else {
                        console.log("here")
                        if(count > 10) callback("ERROR: Not Connected To Database After 1000 Milliseconds");
                        else return reCheck();
                    }
                }, 100);
            } () );
        }
    }

    return {
        addNewConnection,
        disconnect,

        client,
        db,
    };
} () );

module.exports = State;