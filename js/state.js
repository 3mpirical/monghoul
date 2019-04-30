const MongoClient = require('mongodb').MongoClient;
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
            callback(null, db);
        }
    }

    const connect = (mongodbUri, callback) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(mongodbUri, (err, client) => {
                console.log(err);
                if(!err) {
                    addNewConnection(mongodbUri, client, (err, db) => {
                        if(err) {
                            if(callback) callback(err);
                            else reject(err);  
                        } else {
                            if(callback) callback({client, db});
                            else resolve({ client, db });  
                        }
                    });
                } else {
                    if(callback) callback(err);
                    else reject(err);  
                }
            });
        });
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
            const reCheck = function() {
                setTimeout(() => {
                    if(UriHash[mongodbUri]) callback(null, UriHash[mongodbUri].db);
                    else {
                        if(count > 10) return callback("ERROR: Not Connected To Database After 1000 Milliseconds");
                        else count ++; return reCheck();
                    }
                }, 100);
            }; reCheck();
        }
    }

    return {
        addNewConnection,
        connect,
        disconnect,

        client,
        db,
    };
} () );

module.exports = State;