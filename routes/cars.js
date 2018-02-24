var express = require("express");
var router = express.Router();

var Comment = require("../models/comment.js");
var Car = require("../models/car.js");

router.get("/cars", function (request, response) {
    if (request.query.search) {
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

router.get("/cars/new", function (request, response) {
    response.render("cars/new.ejs");
})

router.post("/cars", function (request, response) {
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

router.get("/cars/:id", function (request, response) {
    Car.findById(request.params.id).populate("comments").exec(function (error, car) {
        if (error) {
            console.log(error)
        } else {
            console.log(car);
            response.render("cars/show.ejs", { car: car });
        }
    });
});

router.get("/cars/:id/comments/new", function (request, response) {
    Car.findById(request.params.id, function (error,car) {
        if (error) {
            response.redirect("/cars");
        } else {
            response.render("comments/new.ejs", { car: car });
        }
    });
});

router.post("/cars/:id/comments", function (request, response) {
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

module.exports = router;
