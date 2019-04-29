const fs   = require("fs"),

const createCollectionFile = (name) => fs.writeFileSync(`
const Collection = require("./collection");

class ${name[0].toUpperCase() + name.slice(1)} extends Collection {



}
`)

module.exports = {
    createCollectionFile,
}