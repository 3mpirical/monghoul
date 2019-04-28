const fs = require("fs");
const data = JSON.parse(fs.readFileSync("./state.json"));

const State = (function() {
    const mongodbURI = data.mongodbURI;

    const getMongoURI = () => mongodbURI;

    const setMongoURI = (mongodbURI) => {
        const newData = data;
        newData.mongodbURI = mongodbURI;
        fs.writeFileSync("./state.json", JSON.stringify(newData));
    };

    return {
        getMongoURI,
        setMongoURI,
    }
} () )

module.exports = State;