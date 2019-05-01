const Input  = require("../../InputEmitter"),
      path   = require("path"),
      fs     = require("fs");
      ConfigUtils = require("../../utilities/config");

Input.on("__show_uri", ({option, values}) => {
    let config = ConfigUtils.requireConfigFile();
    if(config) console.log(`Current URI: ${config.uri}`);
});