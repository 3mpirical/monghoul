const State     = require("../state"),
      monghoul  = require("../../app"),
      ObjectId  = require("mongodb").ObjectId,
      pluralize = require("pluralize"),
      fs        = require("fs"),
      path      = require("path");


const ModelWrapper = (function() {
    let uri = null


    class Model {

        static uri(mongodbUri) {
            uri = mongodbUri;
        }

        static find(options) {
            return new Promise((resolve, reject) => {
                const db = State.db(uri);
                const name = pluralize.plural(this.name.toLowerCase());
                console.log(`collection name: ${name}`);
        
                if(!db) reject("ERROR: You Are Not Connected To The Database Yet");
                
                if(!options) {
                    resolve( db.collection(name).find().next() );
        
                } else if(typeof options === "string") {
                    if(!ObjectId.isValid(options)) reject("ERROR: Value Passed Is Not A Valid ObjectId");
                    resolve( db.collection(name).find({_id: ObjectId(options)}).next() );
                } else {
                    resolve( db.collection(name).find(options).next() );
                }
            });
        }

        static all(options) {
            return new Promise((resolve, reject) => {
                const db = State.db(uri);
                const name = pluralize.plural(this.name.toLowerCase());
                console.log(`collection name: ${name}`);
        
                if(!db) reject("ERROR: You Are Not Connected To The Database Yet");
                
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
        }

        static create(values) {
            return new Promise((resolve, reject) => {
                const db = State.db(uri);
                const name = pluralize.plural(this.name.toLowerCase());

                if(!db) reject("ERROR: You Are Not Connected To The Database Yet");

                db.collection(name).insertOne(values).then((res) =>{
                    resolve( db.collection(name).find({_id: ObjectId(res.insertedId)}).next() );
                })
                .catch((err) => reject(err));
            });
        }
    }

    return Model;
} () )

const modelData = (name) => (
`const Monghoul = require("monghoul");
const config = require("../.monghoul/monghoul.config");

class ${name} extends Monghoul.Model {
///// Write Custom Methods Here /////






}

///// Model Configuration /////
${name}.uri(config.uri);





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

// class User extends Collection {

// }

// class Student extends Collection {

// }

// Monghoul.connect("mongodb://127.0.0.1/monghoul-test")
// .then((client) => {
//    return Student.create({ name: "Harry", year: 2019 });
// })
// .then((res) => {
//     console.log(res);
//     State.client().close();
// })
// .catch((err) => {
//     console.log(err);
//     State.client().close();
// });


///// This Function Gets Collection name/validator/jsonschema
// State.db().collections((err, collections) => {
//     collections.forEach((collection) => {
//         console.log(collection.s.name);
//         collection.options()
//         .then((res) => console.log(JSON.stringify(res, null, 2)) )
//         .catch((err) => console.log(err))
//     })
// })