var Comment = require("../models/comment.js");
var Car = require("../models/car.js");

var middleware = {
    isLoggedIn: function (request, response, next) {
        if (request.isAuthenticated()) {
            return next();
        }
        response.redirect("/login");
    },

    checkCarOwnership: function (request, response, next) {
        if (request.isAuthenticated()) {
            Car.findById(request.params.id, function (error, car) {
                if (error) {
                    response.redirect("back");
                } else {
                    if (car.author.id.equals(request.user._id)) {
                        next();
                    } else {
                        response.redirect("back");
                    }
                }
            });
        } else {
            response.redirect("back");
        }
    },

    checkCommentOwnership: function (request, response, next) {
        if (request.isAuthenticated()) {
            Comment.findById(request.params.comment_id, function (error, comment) {
                if (error) {
                    response.redirect("back");
                    console.log(error);
                } else {
                    if (comment.author.id.equals(request.user._id)) {
                        next();
                    } else {
                        console.log(comment.author);
                        response.redirect("back");
                    }
                }
            });
        } else {
            response.redirect("/login");
        }
    }





}



module.exports = middleware;