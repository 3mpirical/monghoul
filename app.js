const   MongoClient = require('mongodb').MongoClient,
        State = require("./js/state"),
        Collection = require("./js/utilities/collection"),
        path = require("path");

module.exports = {

    Collection,

    connect(MongodbURI, callback) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(MongodbURI, (err, client) => {
                if(!err) {
                    State.setClient(client);
                    State.setDb(client);
    
                    if(callback) callback(err, client);
                    else resolve(client);
                    
                } else reject(err);
            });
        });
    }
};

console.log(path.resolve(__dirname, "../"))