const   MongoClient = require('mongodb').MongoClient,
        State = require("./js/state"),
        Collection = require("./js/utilities/collection"),

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