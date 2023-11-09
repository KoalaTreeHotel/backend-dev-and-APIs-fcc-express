require("dotenv").config();
// Body parser middleware for POST
let bodyParser = require("body-parser");

let express = require("express");
let app = express();

// const path = require("path");
// const __dirname = path.resolve(path.dirname(""));

// Used for POST, as usual, must mount the middleware
// must be mounted before all the routes that depend on it
// User data POSTed in body, not in URL
let middlewareParse = bodyParser.urlencoded({ extended: false });
app.use(middlewareParse);

// Mount the logger middleware
app.use(function middleware(req, res, next) {
    // Do something
    let myString = req.method + " " + req.path + " - " + req.ip;
    console.log(myString);
    // Call the next function in line:
    next();
});

// Console output
console.log("dirname = " + __dirname);

// Initial working Express server
// app.get("/", (req, res) => {
//   res.send("Hello Express");
// });

// Serving static assets (normal usage)
app.use(express.static(__dirname + "/public"));
// // Serving static assets (at the /public route)
// app.use("/public", express.static(__dirname + "/public"));

// Serve an HTML file
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

// Serve a JSON specific route (and make it uppercase based on .env variable)
// Needs .env file (see .env.example)
app.get("/json", (req, res) => {
    let myMsg = "Hello json";
    if (process.env.MESSAGE_STYLE === "uppercase") {
        myMsg = myMsg.toUpperCase();
    }
    res.json({
        message: myMsg,
    });
});

// Chaining middleware together.
// Endpoint "/now" returns the current JSON time.
app.get("/now", (req, res, next) => {
    req.time = new Date().toString();
    next();
}, (req, res) => {
    res.json({ time: req.time });
});

// Getting a route parameter input from the user / client
// Using the URL to pass data to the server (after the route
// path)
// eg: 127.0.0.1/tree/echo  ->  {"echo":"tree"}
app.get("/:word/echo", (req, res) =>
    res.send({ "echo": req.params.word }));

// Get Query Parameter Input from the Client via URL
// (after the route path, add in data)
// EG: 127.0.0.1:3000/name?first=FIRSTNAME&last=LASTNAME
// EG: http://127.0.0.1:3000/name?first=John&last=Smith
app.route("/name").get((req, res) =>
    res.send({ "name": `${req.query.first} ${req.query.last}` }));

// Use body-parser to Parse POST Requests
// Instead of using the URL (parameters after the route path),
// We can also POST data. POST is the default method to send
// data with HTML forms.
// In REST convention, POST is used to send data to create new
// items in a database.
// In these kind of requests, the data doesn't appear in the URL,
// it is hidden in the request body (beware, hidden, but NOT private)
//
// We're getting the data from the HTML form in index.html
// (not from the URL). This form has an action of "/name"
// HTML form action specifies the URL to send the form-data
app.route("/name").post((req, res) =>
    res.send({ "name": `${req.body.first} ${req.body.last}` }));

// Get Data from POST Requests






























module.exports = app;
