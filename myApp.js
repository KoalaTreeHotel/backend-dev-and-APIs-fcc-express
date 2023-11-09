// express module required
let express = require("express");
let app = express();

// Routes implemented from top to bottom.
// If two routes have the same path eg: both app.get("/name"), only the first one will be implemented / served.

// dotenv module required to access .env environment variables (used in step 5)
require("dotenv").config();

// body parser middleware to decode data from the http verb POST
let bodyParser = require("body-parser");

//(11) USE BODY-PARSER TO PARSE POST REQUESTS: Besides GET, there is another common HTTP verb, it is POST. POST is the default method used to send client data with HTML forms. In REST convention, POST is used to send data to create new items in the database (a new user, or a new blog post). You don’t have a database in this project, but you are going to learn how to handle POST requests anyway.
// In these kind of requests, the data doesn’t appear in the URL, it is hidden in the request body. The body is a part of the HTTP request, also called the payload. Even though the data is not visible in the URL, this does not mean that it is private
// Used for POST http verbs
// As usual, the middleware must be mounted before all the routes that depend on it
// User data POSTed in body, not in URL
let middlewareParse = bodyParser.urlencoded({ extended: false });
app.use(middlewareParse);


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
/*
app.get("/json", function(req, res) {
    res.json({"message": "Hello json"});
});
*/


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


//(9) GET ROUTE PARAMETER INPUT FROM THE CLIENT: When building an API, we have to allow users to communicate to us what they want to get from our service. For example, if the client is requesting information about a user stored in the database, they need a way to let us know which user they're interested in. One possible way to achieve this result is by using route parameters. Route parameters are named segments of the URL, delimited by slashes (/). Each segment captures the value of the part of the URL which matches its position. The captured values can be found in the req.params object.
// Parameters / values are prefixed with a colon(:) in the URL
//    route_path: '/user/:userId/book/:bookId'
//    actual_request_URL: '/user/546/book/6754'
//    req.params: {userId: '546', bookId: '6754'}
app.get("/:word/echo",
    (req, res) => {
        let stringToEcho = req.params.word;
        res.send({ "echo" : stringToEcho });
        // NB: either res.send() or res.json() can be used
        // res.json({ "echo" : stringToEcho });
        // The methods are identical when an object or array is passed, but res.json() will also convert non-objects, such as null and undefined, which are not valid JSON.
    });


//(10) GET QUERY PARAMETER INPUT FROM THE CLIENT: Another common way to get input from the client is by encoding the data after the route path, using a query string. The query string is delimited by a question mark (?), and includes field=value couples. Each couple is separated by an ampersand (&). Express can parse the data from the query string, and populate the object req.query. Some characters, like the percent (%), cannot be in URLs and have to be encoded in a different format before you can send them. If you use the API from JavaScript, you can use specific methods to encode/decode these characters.
// Keys / values passed in URL via query string
// ?            - start of query string
// field=value  - data / items
// &            - sepearates the different data / items
//    route_path: '/library'
//    actual_request_URL: '/library?userId=546&bookId=6754'
//    req.query: {userId: '546', bookId: '6754'}
// http://127.0.0.1:3000/name?first=Bill&last=Gates
/*
-- This works but code below is cleaner as it allows us to chain different verb
-- handlers on the same route.
app.get("/name", (req, res) =>
    res.send({ "name": `${req.query.first} ${req.query.last}` }));
*/
app.route("/name").get((req, res) => {
    res.json({ "name": `${req.query.first} ${req.query.last}` });
});


//(11) is at the top


//(12) GET DATA FROM POST REQUESTS: Mount a POST handler at the path /name. It’s the same path as before. We have prepared a form in the html frontpage. It will submit the same data of exercise 10 (Query string). If the body-parser is configured correctly, you should find the parameters in the object req.body. Have a look at the usual library example:
//    route: POST '/library'
//    urlencoded_body: userId=546&bookId=6754
//    req.body: {userId: '546', bookId: '6754'}
// Respond with the same JSON object as used before in (ten): {name: 'firstname lastname'}. Test if your endpoint works using the html form we provided in the app frontpage
app.route("/name").post((req, res) => {
    res.send({ "name": `${req.body.first} ${req.body.last}` });
});


// Route data
//     route_path: '/:wordToEcho/echo'
//     actual request URL: 'http://127.0.0.1:3000/doggyEcho/echo'
// Query string data
//     route_path: '/name'
//     actual request URL: 'http://127.0.0.1:3000/name?first=Bill&last=Gates'
// Body parsed data from HTML form
//     data in the form's BODY is what is sent / POSTed to the server


// exporting the app needs to be at bottom of the file
module.exports = app;
