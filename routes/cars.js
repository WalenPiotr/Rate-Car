var express = require("express");
var router = express.Router();

var Comment = require("../models/comment.js");
var Car = require("../models/car.js");

var middleware = require("../middleware/index.js");

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

// Create
router.get("/cars/new", middleware.isLoggedIn, function (request, response) {
    response.render("cars/new.ejs");
})

router.post("/cars", middleware.isLoggedIn, function (request, response) {
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

// Read
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

//Update 

router.get("/cars/:id/edit", function (request, response) {
    Car.findById(request.params.id, function (error, car) {
        if (error) {
            console.log(error);
        } else {
            response.render("cars/edit.ejs", { car: car });
        }
    });
});

router.put("/cars/:id", function (request, response) {
    Car.findByIdAndUpdate(request.params.id, request.body.car, function (error, car) {
        if (error) {
            console.log(error);
            response.redirect("/cars");
        } else {
            response.redirect("/cars/" + request.params.id);
        }
    });
});

// Destroy
router.delete("/cars/:id", function (request, response) {
    Car.findByIdAndRemove(request.params.id, function (error) {
        if (error) {
            console.log(error);
        } else {
            response.redirect("/cars");
        }
    });
});


module.exports = router;
