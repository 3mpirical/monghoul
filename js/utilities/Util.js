const fs   = require("fs"),
      path = require("path");

const createCollectionFile = (name) => fs.writeFileSync(`
const Collection = require("./collection");

class ${name[0].toUpperCase() + name.slice(1)} extends Collection {



}
`)

module.exports = {
    createCollectionFile,
}