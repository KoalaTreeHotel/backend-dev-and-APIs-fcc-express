// express module required
let express = require("express");
let app = express();

// dotenv moduke required to access .env environment variables (used in step 5)
require("dotenv").config();

//(1) write info to the console
console.log("Hello World");
console.log("dirname = " + __dirname);


//(2) serve the string "Hello Express" to GET requests matching the / (root) path
/*
app.get("/", function(req, res) {
  res.send("Hello Express")
});
*/


//(3) Send the /views/index.html file as a response to GET requests to the / path
// __dirname returns the root directory is a best practice for node developers.
let absolutePath = __dirname + "/views/index.html";
app.get("/", function(req, res) {
    res.sendFile(absolutePath);
});


//(4) Mount the express.static() middleware to the path /public with app.use(). The absolute path to the assets folder is __dirname + /public.
// Now your app should be able to serve a CSS stylesheet. Note that the /public/style.css file is referenced in the /views/index.html in the project boilerplate. Your front-page should look a little better now!
app.use("/public", express.static(__dirname + "/public"));


//(5) Create a simple API by creating a route that responds with JSON data at the path /json. Use app.get() to serve the JSON object {"message": "Hello json"}.
//(6) Read variable MESSAGE_STYLE's value from .env via "process.env.VARIABLE" (requires dotenv declared above)
app.get("/json", function(req, res) {
    if (process.env.MESSAGE_STYLE === "uppercase") {
        res.json({"message": "HELLO JSON"});
    }
    else {
        res.json({"message": "Hello json"});
    }
});  

  


































module.exports = app;
