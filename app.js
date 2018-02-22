var express = require("express")

var app = express()
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.render("landing.ejs");
});

app.get("/brands", function (req, res) {
    res.render("brands.ejs");
});

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Server has started on: ");
    console.log("PORT: " + process.env.PORT);
    console.log("IP: " + process.env.IP);
});


