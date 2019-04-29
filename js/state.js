const fs = require("fs");
const path = require("path");
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../state.json")));

const State = (function() {
    ///// STATE VARIABLES /////
    const mongodbURI = data.mongodbURI;
    const UriHash = {};

    ///// GETTERS/SETTERS /////
    const getMongoURI = () => mongodbURI;
    const setMongoURI = (mongodbURI) => {
        const newData = data;
        newData.mongodbURI = mongodbURI;
        fs.writeFileSync(path.resolve(__dirname, "state.json"), JSON.stringify(newData));
    };

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
        getMongoURI,
        setMongoURI,

        addNewConnection,
        disconnect,

        client,
        db,
    };
} () );

module.exports = State;