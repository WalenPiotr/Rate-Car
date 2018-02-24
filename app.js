var express = require("express");
var app = express()

var mongoose = require("mongoose");
mongoose.connect(process.env.DBURL);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

var methodOverride = require("method-override");
app.use(methodOverride("_method"));

var Car = require("./models/car.js");

app.get("/", function (request, response) {
    response.render("landing.ejs");
});

var seed = require("./seeds.js");
seed();

app.get("/cars", function (request, response) {
    if (request.query.search) {
        // const regex = new RegExp(escapeRegex(request.query.search), 'gi');
        Car.find({ $text: { $search: request.query.search } }, { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } })
            .exec(function (error, cars) {
                if (error) {
                    console.error(error)
                } else {
                    console.log(cars)
                    response.render("cars/index.ejs", { cars: cars });
                }
            });
    } else {
        Car.find({}, function (error, cars) {
            if (error) {
                console.error(error)
            } else {
                response.render("cars/index.ejs", { cars: cars });
            }
        });
    }
});

app.get("/cars/new", function (request, response) {
    response.render("cars/new.ejs");
})

app.post("/cars", function (request, response) {
    Car.create(request.body.car, function (error, car) {
        if (error) {
            console.error(error);
        } else {
            car.save();
            console.log("Created new car!")
        }
    });
    response.redirect("/cars");
});

app.get("/cars/:id",function(request,response){
    Car.findById(request.params.id, function(error, car){
        response.render("cars/show.ejs", {car: car});
    });
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Server has started on: ");
    console.log("PORT: " + process.env.PORT);
    console.log("IP: " + process.env.IP);
});


