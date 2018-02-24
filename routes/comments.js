var express = require("express");
var router = express.Router();

var Comment = require("../models/comment.js");
var Car = require("../models/car.js");

var middleware = require("../middleware/index.js");


router.get("/cars/:id/comments/new", middleware.isLoggedIn,  function (request, response) {
    Car.findById(request.params.id, function (error,car) {
        if (error) {
            response.redirect("/cars");
        } else {
            response.render("comments/new.ejs", { car: car });
        }
    });
});

router.post("/cars/:id/comments", middleware.isLoggedIn, function (request, response) {
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

