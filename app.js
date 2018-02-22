var express = require("express");
var mongoose = require("mongoose");


var app = express()
app.use(express.static(__dirname + "/public"));

var brandSchema = new mongoose.Schema({
    name: String,
});


app.get("/", function (req, res) {
    res.render("landing.ejs");
});

app.get("/brands", function (req, res) {
    res.render("brands.ejs");
});

app.get("/brands/new", function(req, res){
    res.render("new.ejs");
})

app.post("/brands",function(req,res){
    res.send("post route");
});




app.get("/models", function (req, res) {
    res.render("models.ejs");
});

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Server has started on: ");
    console.log("PORT: " + process.env.PORT);
    console.log("IP: " + process.env.IP);
});


