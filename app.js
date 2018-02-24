var express = require("express");
var app = express()

var mongoose = require("mongoose");
mongoose.connect(process.env.DBURL);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

var methodOverride = require("method-override");
app.use(methodOverride("_method"));

var Comment = require("./models/comment.js");
var Car = require("./models/car.js");

app.get("/", function (request, response) {
    response.render("landing.ejs");
});

// var seed = require("./seeds.js");
// seed();

app.get("/cars", function (request, response) {
    if (request.query.search) {
        // const regex = new RegExp(escapeRegex(request.query.search), 'gi');
        Car.find({ $text: { $search: request.query.search } }, { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } })
            .exec(function (error, cars) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(cars)
                    response.render("cars/index.ejs", { cars: cars });
                }
            });
    } else {
        Car.find({}, function (error, cars) {
            if (error) {
                console.log(error)
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
            console.log(error);
        } else {
            car.save();
            console.log("Created new car!")
        }
    });
    response.redirect("/cars");
});

app.get("/cars/:id", function (request, response) {
    Car.findById(request.params.id).populate("comments").exec(function (error, car) {
        if (error) {
            console.log(error)
        } else {
            console.log(car);
            response.render("cars/show.ejs", { car: car });
        }
    });
});

app.get("/cars/:id/comments/new", function (request, response) {
    Car.findById(request.params.id, function (error,car) {
        if (error) {
            response.redirect("/cars");
        } else {
            response.render("comments/new.ejs", { car: car });
        }
    });
});

app.post("/cars/:id/comments", function (request, response) {
    Car.findById(request.params.id, function (error, car) {
        if (error) {
            response.redirect("/cars");
        } else {
            Comment.create(request.body.comment, function (error, comment) {
                if (error) {
                    console.log(error);
                } else {
                    comment.save();
                    car.comments.push(comment._id);
                    car.save();
                    response.redirect("/cars/" + request.params.id);
                }
            });
        }
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


