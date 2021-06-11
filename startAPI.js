const exec = require("child_process").exec;
module.exports = { startAPI };

 function startAPI() {
   console.log("running the api");
  exec("node app.js");
}