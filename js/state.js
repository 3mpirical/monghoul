const fs = require("fs");
const path = require("path");
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../state.json")));

const State = (function() {
    const mongodbURI = data.mongodbURI;
    let appClient = null;
    let appDb = null;

    const getMongoURI = () => mongodbURI;
    const setMongoURI = (mongodbURI) => {
        const newData = data;
        newData.mongodbURI = mongodbURI;
        fs.writeFileSync(path.resolve(__dirname, "state.json"), JSON.stringify(newData));
    };

    const setClient = (newClient) => appClient = newClient;
    const client = () => appClient;

    const setDb = (appClient) => appDb = appClient.db(appClient.s.options.dbName);
    const db = () => appDb;

    const createJS = (name, javascript) => {
        fs.writeFileSync(`./${name}.js`, javascript);
    }

    return {
        getMongoURI,
        setMongoURI,
        client,
        setClient,
        db,
        setDb,
        createJS,
    }
} () )

module.exports = State;