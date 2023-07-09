let express = require('express');
let app = express();

// app.get("/", (req, res) => {
//   res.send("Hello Express");
// });

// Normal usage
app.use(express.static(__dirname + "/public"));
// Assets at the / public route
app.use("/public", express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});
console.log("dirname = " + __dirname);
module.exports = app;
