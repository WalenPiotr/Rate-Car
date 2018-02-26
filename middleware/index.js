var Comment = require("../models/comment.js");
var Car = require("../models/car.js");

var middleware = {
    isLoggedIn: function (request, response, next) {
        if (request.isAuthenticated()) {
            return next();
        }
        request.flash("error", "You need to be logged in to do that!");
        response.redirect("/login");
    },

    checkCarOwnership: function (request, response, next) {
        if (request.isAuthenticated()) {
            Car.findById(request.params.id, function (error, car) {
                if (error) {
                    request.flash("error", "Car not found!");
                    response.redirect("back");
                } else {
                    if (car.author.id.equals(request.user._id) || request.user.admin === true) {
                        next();
                    } else {
                        request.flash("error", "You do not have permission to do that!");
                        response.redirect("back");
                    }
                }
            });
        } else {
            request.flash("error", "You need to be logged in to do that!");
            response.redirect("back");
        }
    },

    checkCommentOwnership: function (request, response, next) {
        if (request.isAuthenticated()) {
            Comment.findById(request.params.comment_id, function (error, comment) {
                if (error) {
                    request.flash("error", "Car not found!");
                    response.redirect("back");
                } else {
                    if (comment.author.id.equals(request.user._id) || request.user.admin === true) {
                        next();
                    } else {
                        request.flash("error", "You do not have permission to do that!");
                        response.redirect("back");
                    }
                }
            });
        } else {
            request.flash("error", "You need to be logged in to do that!");
            response.redirect("/login");
        }
    }





}



module.exports = middleware;