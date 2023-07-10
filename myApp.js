require("dotenv").config();

let express = require("express");
let app = express();

const path = require("path");
const __dirname = path.resolve(path.dirname(""));

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
app.get("/json", (req, res) => {
    let myMsg = "Hello json";
    if (process.env.MESSAGE_STYLE === "uppercase") {
        myMsg = myMsg.toUpperCase();
    }
    res.json({
        message: myMsg,
    });
});





































module.exports = app;
