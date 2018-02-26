var express = require("express");
var router = express.Router();

var Comment = require("../models/comment.js");
var Car = require("../models/car.js");

var mongoose = require("mongoose");

var middleware = require("../middleware/index.js");


// Create
router.get("/cars/:id/comments/new", middleware.isLoggedIn, function (request, response) {
    Car.findById(request.params.id, function (error, car) {
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
                    comment.author.id = request.user._id;
                    comment.author.username = request.user.username;
                    comment.save();
                    car.comments.push(comment._id);
                    car.save();
                    request.flash("success", "Comment has been created.");
                    response.redirect("/cars/" + request.params.id);
                }
            });
        }
    });
});

//Update
router.get("/cars/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function (request, response) {
    Comment.findById(request.params.comment_id, function (error, comment) {
        if (error) {
            response.redirect("/cars/" + request.params.id);
        } else {
            response.render("comments/edit.ejs", { car_id: request.params.id, comment: comment });
        }
    });
});

router.put("/cars/:id/comments/:comment_id", middleware.checkCommentOwnership, function (request, response) {
    Comment.findByIdAndUpdate(request.params.comment_id, request.body.comment, function (error, comment) {
        if (error) {
            console.log(error);
        }
        request.flash("success", "Comment has been updated.");
        response.redirect("/cars/" + request.params.id);
    });
});

// Destroy
router.delete("/cars/:id/comments/:comment_id", middleware.checkCommentOwnership, function (request, response) {
    Comment.findByIdAndRemove(request.params.comment_id, function (error) {
        if (error) {
            console.log(error);
        } else {
            Car.findById(request.params.id, function(error, car){
                if(error){
                    console.log(error);
                } else {
                    car.comments.remove(request.params.comment_id);
                    car.save();
                }
            });
            request.flash("success", "Comment has been removed.");
            response.redirect("back");
        }
    });
});


module.exports = router;

