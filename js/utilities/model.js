const State     = require("../state"),
      ObjectId  = require("mongodb").ObjectId,
      pluralize = require("pluralize"),
      fs        = require("fs"),
      path      = require("path");


const ModelWrapper = (function() {
    let uri = null;

    class Model {

        static uri(mongodbUri) {
            uri = mongodbUri;
        }

        static find(options) {
            return new Promise((resolve, reject) => {
                State.db(uri, (err, db) => {
                    if(err) return reject(err);
                    const name = pluralize.plural(this.name.toLowerCase());
                    console.log(`collection name: ${name}`);
            
                    if(!db) reject("ERROR: You Are Not Connected To The Database Yet");
                    
                    if(!options) {
                        reject("ERROR: 'find' Method On Model Must Be Given A Parameter");
                    } else if(typeof options === "string") {
                        if(!ObjectId.isValid(options)) reject("ERROR: Value Passed Is Not A Valid ObjectId");
                        resolve( db.collection(name).find({_id: ObjectId(options)}).next() );
                    } else {
                        resolve( db.collection(name).find(options).next() );
                    }
                })
            });
        }

        static all(options) {
            return new Promise((resolve, reject) => {
                State.db(uri, (err, db) => {
                    if(err) return reject(err);
                    const name = pluralize.plural(this.name.toLowerCase());
                    console.log(`collection name: ${name}`);
                    
                    if(!options) {
                        db.collection(name).find().toArray((err, docs) => {
                            if(err) reject(err);
                            else resolve(docs);
                        }) 
                    } else {
                        db.collection(name).find(options).toArray((err, docs) => {
                            if(err) reject(err);
                            else resolve(docs);
                        }) 
                    }
                })
            })
        }

        static create(values) {
            return new Promise((resolve, reject) => {
                State.db(uri, (err, db) => {
                    if(err) return reject(err);
                    const name = pluralize.plural(this.name.toLowerCase());
    
                    db.collection(name).insertOne(values).then((res) =>{
                        resolve( db.collection(name).find({_id: ObjectId(res.insertedId)}).next() );
                    })
                    .catch((err) => reject(err));
                })
            });
        }

        static createCollection(name, jsonSchema) {
            return new Promise((resolve, reject) => {
                State.db(uri, (err, db) => { 
                    if(err) reject(err);

                    resolve( 
                        db.createCollection(name, { 
                            validator: { 
                                $jsonSchema: { 
                                    properties: jsonSchema 
                                }
                            } 
                        })
                    );

                })
            })
        }
    }

    return Model;
} () );

const modelData = (name) => (
`const Monghoul = require("monghoul");
const config = require("../.monghoul/monghoul.config");

class ${name} extends Monghoul.Model {
    ///// Model Configuration /////
    static config() {
        this.uri(config.uri);



    }

    ///// Custom Methods /////



}

${name}.config();
module.exports = ${name};
`);


const writeModelFile = (name) => {
    name = `${name[0].toUpperCase() + name.slice(1)}`
    return new Promise((resolve, reject) => {
        fs.writeFile(path.resolve(__rootDir, "models", `${name}.js`), modelData(name), (err) => {
            err? reject(err) : resolve("success");
        });
    });
}

module.exports = {
    Model: ModelWrapper,
    writeModelFile,
}

///// This Function Gets Collection name/validator/jsonschema
// db.collections((err, collections) => {
//     collections.forEach((collection) => {
//         collection.options()
//         .then((res) => {
//             console.log(collection.s.name);
//             console.log(JSON.stringify(res, null, 2)) 
//         })
//         .catch((err) => console.log(err))
//     })
// })