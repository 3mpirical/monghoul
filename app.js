const   MongoClient = require('mongodb').MongoClient,
        State = require("./js/state"),
        ModelUtils = require("./js/utilities/model");

module.exports = {

    Model: ModelUtils.Model,

    disconnect: State.disconnect,

    connect: function(mongodbUri, callback) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(mongodbUri, (err, client) => {
                if(!err) {
                    State.addNewConnection(mongodbUri, client, (err) => {
                        if(err) {
                            if(callback) callback(err, client);
                            else reject(err);  
                        } 
                    });

                    if(callback) callback(err, client);
                    else resolve(client);
                    
                } else {
                    if(callback) callback(err, client);
                    else reject(err);  
                }
            });
        });
    },
};