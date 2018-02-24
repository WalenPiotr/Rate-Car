var express = require("express");
var app = express()

var mongoose = require("mongoose");
mongoose.connect(process.env.DBURL);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

var methodOverride = require("method-override");
app.use(methodOverride("_method"));


var indexRoutes = require("./routes/index")
var carRoutes = require("./routes/cars")

app.use(indexRoutes);
app.use(carRoutes);


app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Server has started on: ");
    console.log("PORT: " + process.env.PORT);
    console.log("IP: " + process.env.IP);
});


