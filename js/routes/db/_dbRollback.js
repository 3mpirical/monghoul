const Input = require("../../InputEmitter");
const path = require("path");

/// How do we delete a collection ?????
/// How will we create a collection again?????


const rollbackExecution = (oldSchema, currentSchema) => {
    return new Promise((resolve, reject) => {
        class Rollback extends Monghoul.Migration{}
        let createArr = [];
        let deleteArr = [];
        let updateArr = [];

        for(collection in oldSchema) {
            if(currentSchema[collection]) {
                // if collection is found in both schemas, then it must be updated
                updateArr.push(collection);

                // delete the item from th new schema, so that what remains by the end
                // are collecitons created by the last migration that will need
                // to be destroyed
                delete currentSchema[collection];
            } 
            else {
                // if collection is in the old schema, but not in new schema
                // then we will need to push it in the create array, and recreate it
                createArr.push(collection);
            }
        }
        // anything left in the new schema that wasn't in the old schema will need to be deleted
        deleteArr = currentSchema;

        
        let createCount = 0;
        let deleteCount = 0;
        let updateCount = 0;

        const executionHelper = () => {
            // create function

            // delete function


            // update function
            // Rollback.updateCollection(collections[count]);
            // Rollback.run().then((res) => {

            //     count ++;
            //     if(count === collections.length) resolve("success");
            //     else return executionHelper();
            // })
            // .catch(reject);
        };

        executionHelper();
    });
}

Input.on("db:rollback", ({option, values}) => {
    const oldSchema = "something";
    const currentSchema = require( path.resolve(__rootDir, "db", "schema.json") )
    console.log(currentSchema);

    // rollbackExecution(oldSchema, currentSchema);

});