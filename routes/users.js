var express = require("express");
var router = express.Router();
var User = require("../models/user.js");
var Comment = require("../models/comment.js");
var Car = require("../models/car.js");
var async = require("async");

router.get("/users/:id", (request, response) => {
    User.findById(request.params.id, function (err, user) {
        if (err) {
            request.flash("error", "Something went wrong.");
            return response.redirect("/");
        }
        Comment.find().where('author.id').equals(user._id).populate("car").exec((error, comments) => {
            if (error) {
                request.flash("error", "Something went wrong.");
                return response.redirect("/");
            }
                console.log(comments);
                response.render("users/show.ejs", { user: user, comments: comments});
        });
    });
});

module.exports = router;

