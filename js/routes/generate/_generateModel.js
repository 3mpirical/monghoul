const Input           = require("../../InputEmitter"),
      ModelUtils = require("../../utilities/model");

const { writeModelFile } = ModelUtils;

const handleGenerateModel = ({ option, values }) => {
    const name = values[1];
    if(!name) return console.log("ERROR: Models Must Have A Name");
    // 1) parse values 
    // 2) create model
    writeModelFile(name)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => console.log(err));
    // 3) create migration
};


Input.on("__generate_model", handleGenerateModel)