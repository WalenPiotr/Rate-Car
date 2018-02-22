var express = require("express");
var app = express()

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/RateCar");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

var Model = require("./models/model");
var Brand = require("./models/brand");

app.get("/", function (request, response) {
    response.render("landing.ejs");
});

app.get("/brands", function (request, response) {
    Brand.find({}, function (error, brands) {
        if (error) {
            console.error(error)
        } else {
            console.log(brands);
            response.render("brands/index.ejs", { brands: brands });
        }
    });
});

app.get("/brands/new", function (request, response) {
    response.render("brands/new.ejs");
})

app.post("/brands", function (request, response) {
    Brand.create({name: request.body.name}, function(error, brand){
        if(error){
            console.error(error);
        } else {
            console.log(brand);
        }
    })
    response.redirect("/brands");
});

app.get("/brands/:id", function(request, response){
    Brand.findById(request.params.id).populate("models").exec(function(error, brand){
        response.render("models/index.ejs", {brand: brand});
    });
});


app.listen(8888, "127.0.0.1", function () {
    console.log("Server has started on: ");
    console.log("PORT: " + process.env.PORT);
    console.log("IP: " + process.env.IP);
});


