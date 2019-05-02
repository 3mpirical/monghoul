const State  = require("../state"), 
      pluralize = require("pluralize"),
      fs        = require("fs"),
      path      = require("path");


const handleProperty = (attrName, args) => {
    const validationsArr = args.split(",");
    const property = {
        type: "property",
        name: attrName,
        validations: []
    }

    validationsArr.forEach((argument) => {
        const argArr =  argument.split(":");
        if(argArr.length !== 2) return console.log(`ERROR: Incorrect Syntax For Attribute ${item}`);
        let key = argArr[0];
        let value = argArr[1];
        property.validations.push({ key, value });
    });

    return property;
}

const handleRequired = (args) => {
    const required = {
        type: "required",
        items: [],
    }

    args.split(",").forEach((item) => {
        required.items.push(item);
    });
    return required;
}


const parseToMigrationArray = (argsArray) => {
    const migrationArr = [];

    argsArray.forEach((item) => {
        console.log(item);
        let attrName = null;
        let validationsArr = [];
        let endNameIndex = null;
        let argsBegin = null;
        let argsEnd = null;
        let args = null;

        item.split("").forEach((char, index) => {
            if(char === "[") {
                endNameIndex = index;
                argsBegin = index + 1;
            }
            else if(char === "]") {
                argsEnd = index;
            }
        });

        if(endNameIndex < 0) return console.log("ERROR: A Property Name Was Not Passed");
        if(!argsBegin || !argsEnd) return console.log("ERROR: Arguments Not Within Parenthesis");

        attrName = item.slice(0, endNameIndex);
        args = item.slice(argsBegin, argsEnd);
        if(attrName === "required") {
            migrationArr.push(handleRequired(args));
        } else {
            migrationArr.push(handleProperty(attrName, args));
        }
    });
    console.log(migrationArr);
    return migrationArr;
};



const writeCollectionMigrationFile = (name, migrationArr, isNewCollection) => {
    return new Promise((resolve, reject) => {
        let requiredArr = [];
        let migrationFuncs = [];
        name = name[0].toUpperCase() + name.slice(1);
    
        migrationArr.forEach((item) => {
            if(item.type === "property") {
                const validations = item.validations.map((validation) => {
                    const { key, value } = validation;
                    return `, { ${key}: "${value}" }`;
                })
                migrationFuncs.push(`        this.addProperty("${item.name}"${validations.join(" ")});`);
            } else if(item.type === "required") {
                requiredArr = item.items.map((item) => `"${item}"`);
            }
        });
    
        
        const fileData = 
`#!/usr/bin/env node

const Monghoul = require("monghoul");
const config = require("../../.monghoul/monghoul.config");


class CreateCollection${name} extends Monghoul.Migration {
    static migrate() {
        ${isNewCollection
         ? `this.createCollection("${pluralize.plural(name.toLowerCase())}");` 
         : `this.updateCollection("${pluralize.plural(name.toLowerCase())}");`
        }
        ${requiredArr.length > 0? `this.required(${requiredArr});` : "" }

${migrationFuncs.join("\n")}


        this.options();
        this.run(config.uri);
    }
}

CreateCollection${name}.migrate();
`;
        const filePath = path.resolve(__rootDir, "db", "migrations", `${Date.now()}-CreateCollection${name}-Migration.js`);
        fs.writeFile(filePath, fileData, { mode: 0o755}, (err) => {
            if(err) reject(err);
            console.log(`CREATED: ${filePath}`);
            resolve("success");
        });
    });
};

const writeMigrationFile = (name) => {
    return new Promise((resolve, reject) => {    
        
        const fileData = 
`#!/usr/bin/env node

const Monghoul = require("monghoul");
const config = require("../../.monghoul/monghoul.config");
const schema = require("../schema.json");


class ${name} extends Monghoul.Migration {
    static migrate() {
        this.schema(schema);
        // Sets the collection to update ( Required )
        // ${ `this.updateCollection("<collection>");` }

        // overwrites required properties
        // this.required("<updated-required-properties>");


        // Functions to add properties and validations ( parameters can take multiple validation objects )
        // this.addProperty("<property>", {"<validation-type>": "<validation-value>"});
        // this.addValidation("<property>", {"<validation-type>": "<validation-value>"});
        

        // Functions to remove properties and validations
        // this.removeProperty("<property>");
        // this.removeValidation("<property>", "<validation-name>");


        // overwrites all other options in mongodb validator object
        // this.options("<options-object>");
        this.run(config.uri);
    }
}

${name}.migrate();
`;
        const filePath = path.resolve(__rootDir, "db", "migrations", `${Date.now()}-${name}-Migration.js`);
        fs.writeFile(filePath, fileData, { mode: 0o755}, (err) => {
            if(err) reject(err);
            console.log(`CREATED: ${filePath}`);
            resolve("success");
        });
    });
};

const MigrationWrapper = (function() {
    let create = false;
    let update = false;
    let schema = null;
    let name = null;
    let required = null;
    let properties = {};

    class Migration {
        static createCollection(collectionName) {
            name = collectionName;
            create = true;
        }

        static updateCollection(collectionName) {
            name = collectionName;
            update = true;
        }

        static addProperty(property, ...values) {
            if(create) {
                if(!properties[property]) properties[property] = {};
                values.forEach((value) => {
                    for(let key in value) {
                        properties[property][key] = value[key];
                    }
                });
            } else if(update) {
                if(!schema[name]) return new Error("ERROR: collection does not exist");
                if(!schema[name].validator.$jsonSchema.properties[property]) schema[name].validator.$jsonSchema.properties[property] = {};
                values.forEach((value) => {
                    for(let key in value) {
                        console.log(schema[name].validator.$jsonSchema);
                        schema[name].validator.$jsonSchema.properties[property][key] = value[key];
                    }
                });
            }
        }
        
        static addValidation(property, ...values) {
            if(!schema) return new Error("ERROR: addValidation Must Only Be Used To Update Schema's. Use addProperty When Creating Collections");
            if(!schema[name]) return new Error("ERROR: collection does not exist");
            if(!schema[name].validator.$jsonSchema.properties[property]) return new Error("ERROR: Property Name Does Not Exist. Cannot Add Validation In Migration");;
            values.forEach((value) => {
                for(let key in value) {
                    schema[name].validator.$jsonSchema.properties[property][key] = value[key];
                }
            });
        }
        
        static removeProperty(property) {
            if(!schema) return new Error("ERROR: removeProperty Must Only Be Used To Update Schema's. Use addProperty When Creating Collections");
            if(!schema[name]) return new Error("ERROR: collection does not exist");
            if(!schema[name].validator.$jsonSchema.properties[property]) return new Error("ERROR: Property Name Does Not Exist. Cannot Remove Validation In Migration");
            delete schema[name].validator.$jsonSchema.properties[property];
        }
        
        static removeValidation(property, ...keys) {
            if(!schema) return new Error("ERROR: removeValidation Must Only Be Used To Update Schema's. Use addProperty When Creating Collections");
            if(!schema[name]) return new Error("ERROR: collection does not exist");
            if(!schema[name].validator.$jsonSchema.properties[property]) return new Error("ERROR: Property Name Does Not Exist. Cannot Remove Validation In Migration");
            keys.forEach((key) => {
                delete schema[name].validator.$jsonSchema.properties[property][key];
            });
        }
        
        static required(...properties) {
            if(create) {
                required = properties;
            } else if(update) {                
                if(!schema) return new Error("ERROR: Current Schema Not Specified For Update");
                if(!schema[name]) return new Error("ERROR: collection does not exist");
                if(!schema[name].required) schema[name].validator.$jsonSchema.required = [];
                schema[name].validator.$jsonSchema.required = properties;
            }
        }

        static options(object) {

        }

        static schema(oldSchema) {
            schema = oldSchema;
        }

        static run(uri) {
            if(create) {
                State.connect(uri)
                .then(({client, db}) => {
                    let validator = {
                            validator: { $jsonSchema: {
                                properties: properties,
                        }}
                    };
                    if(required) validator.validator.$jsonSchema.required = required;

                    db.createCollection(name, validator, (err) => {
                        if(err) console.log(err);
                        State.disconnect(uri);
                    });
                })
                .catch((err) => console.log(err));
            } else if(update) {
                State.connect(uri)
                .then(({client, db}) => {
                    console.log(schema[name].validator);

                    db.command({ collMod: name, validator: schema[name].validator }, (err) => {
                        if(err) console.log(err);
                        State.disconnect(uri);
                    });
                })
                .catch((err) => console.log(err));
            }
        }
    }
    return Migration;
} () );


module.exports = {
    parseToMigrationArray,
    writeCollectionMigrationFile,
    writeMigrationFile,
    Migration: MigrationWrapper,
}