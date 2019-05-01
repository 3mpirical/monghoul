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



const writeCollectionMigrationFile = (name, migrationArr) => {
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
    })

    const filePath = path.resolve(__rootDir, "db", "migrations", `${Date.now()}-CreateCollection${name}-Migration.js`);
    const fileData = 
`const Monghoul = require("monghoul");
const config = require("../../.monghoul/monghoul.config");


class CreateCollection${name} extends Monghoul.Migration {
    static migrate() {
        this.createCollection("${pluralize.plural(name.toLowerCase())}");
        this.required(${requiredArr});


${migrationFuncs.join("\n")}


        this.options();
        this.run(config.uri);
    }
}

CreateCollection${name}.migrate();
`;

    fs.writeFile(filePath, fileData, (err) => {
        if(err) return console.log(err);
        console.log("success");
    })
}


const MigrationWrapper = (function() {
    let create = false;
    let update = false;
    let name = null;
    let required = [];
    let properties = {};

    class Migration {
        static createCollection(collectionName) {
            name = collectionName;
            create = true;
        }

        static updateCollection(collectionName) {
            
        }

        static addProperty(key, value) {
            properties[key] = value;
        }

        static required(...properties) {
            required = properties;
        }

        static options(object) {

        }

        static run(uri) {
            console.log(uri)
            console.log("Migration Has Been Ran");
            if(create) {
                State.connect(uri)
                .then(({client, db}) => {
                    db.createCollection(name, {
                        validator: { $jsonSchema: {
                            required: required,
                            properties: properties,
                        }}
                    })
                })
                .catch((err) => console.log(err));
            }
        }

    }
    return Migration;
} () );


module.exports = {
    parseToMigrationArray,
    writeMigrationFile,
    writeCollectionMigrationFile,
    Migration: MigrationWrapper,
}