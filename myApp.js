// express module required
let express = require("express");
let app = express();

// dotenv module required to access .env environment variables (used in step 5)
require("dotenv").config();

//(7) IMPLEMENT A ROUTE-LEVEL REQUEST LOGGER MIDDLEWARE: Middleware functions are functions that take 3 arguments: the request object, the response object, and the next function in the application’s request-response cycle. These functions execute some code that can have side effects on the app, and usually add information to the request or response objects. They can also end the cycle by sending a response when some condition is met. If they don’t send the response when they are done, they start the execution of the next function in the stack. This triggers calling the 3rd argument, next(). 
// Note: Express evaluates functions in the order they appear in the code. This is true for middleware too. If you want it to work for all the routes, it should be mounted before them
// Remember, from the 4th step: A middleware needs to be mounted using the method app.use(path, middlewareFunction). The first path argument is optional. If you don’t pass it, the middleware will be executed for all requests.
// Prints request "method path - ipAddress" -> "GET /json - ::ffff:127.0.0.1"
app.use(function middleware(req, res, next) {
    // let myString = req.method + " " + req.path + " - " + req.ip;
    let myString = `${req.method} ${req.path} - ${req.ip}`;
    console.log(myString);
    // Call the next function in the line, must do this or the server will be stuck forever
    next();
});


//(1) MEET THE NODE CONSOLE: write info to the console
console.log("Hello World");
console.log("dirname = " + __dirname);


//(2) START A WORKING EXPRESS SERVER: serve the string "Hello Express" to GET requests matching the / (root) path
/*
app.get("/", function(req, res) {
  res.send("Hello Express")
});
*/


//(3) SERVE AN INDEX.HTML FILE: Send the /views/index.html file as a response to GET requests to the / path
// __dirname returns the root directory is a best practice for node developers.
let absolutePath = __dirname + "/views/index.html";
app.get("/", function (req, res) {
    res.sendFile(absolutePath);
});


//(4) SERVE STATIC ASSETS (via MIDDLEWARE): Mount the express.static() middleware to the path /public with app.use(). The absolute path to the assets folder is __dirname + /public (to use the style.css file in there).
// Now the app should be able to serve the CSS stylesheet. Note that the /public/style.css file is referenced in the /views/index.html in the project boilerplate. Your front-page should look a little better now!
// An HTML server usually has one or more directories that are accessible by the user. Place there static assets needed by your application (stylesheets, scripts, images). In express, you do this using the middleware express.static(path)
// Middleware are functions that intercept route handlers, adding some kind of information. A middleware needs to be mounted using the method app.use(path, middlewareFunction). The first path argument is optional. If you don’t pass it, the middleware will be executed for all requests.
app.use("/public", express.static(__dirname + "/public"));


//(5) SERVE JSON ON A SPECIFIC ROUTE: Create a simple API by creating a route that responds with JSON data at the path /json. Use app.get() to serve the JSON object {"message": "Hello json"}.
// app.get("/json", function(req, res) {
//     res.json({"message": "Hello json"});
// });  

//(6) USE THE .ENV FILE: Read variable MESSAGE_STYLE's value from .env via "process.env.VARIABLE" (requires dotenv declared above)
app.get("/json", function (req, res) {
    if (process.env.MESSAGE_STYLE === "uppercase") {
        res.json({ "message": "HELLO JSON" });
    }
    else {
        res.json({ "message": "Hello json" });
    }
});

//(7) is at the top

//(8) CHAIN MIDDLEWARE TO CREATE A TIME SERVER: Middleware can be mounted at a specific route using app.METHOD(path, middlewareFunction). Middleware can also be chained within a route definition. This is a middleware stack.
app.get("/now", 
    // middleware function assinging current time to req.time 
    (req, res, next) => {
        req.time = new Date().toString();
        next();
    },
    // final handler responding with the JSON data
    (req, res) => {
        res.json({ time: req.time });
    });

//(9) GET ROUTE PARAMETER INPUT FROM THE CLIENT: 



































module.exports = app;
