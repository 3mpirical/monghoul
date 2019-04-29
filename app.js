const   MongoClient = require('mongodb').MongoClient,
        State = require("./js/state"),
        modelUtils = require("./js/utilities/model");

module.exports = {

    Model: modelUtils.Model,

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