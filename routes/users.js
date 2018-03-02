var express = require("express");
var router = express.Router();
var User = require("../models/user.js");
var Comment = require("../models/comment.js");
var Car = require("../models/car.js");
var async = require("async");


router.get("/users", (request, response) => {
    if (request.query.search) {
        User.find({ $text: { $search: request.query.search } }, { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } })
            .exec(function (error, users) {
                if (error) {
                    console.log(error)
                } else {
                    response.render("users/index.ejs", { users: users });
                }
            });
    } else {
        User.find({}, (error, users) => {
            response.render("users/index.ejs", { users: users });
        });
    }
});

router.get("/users/:id", (request, response) => {
    User.findById(request.params.id, function (error, user) {
        if (error) {
            request.flash("error", "Something went wrong.");
            return response.redirect("/");
        }
        Comment.find().where('author.id').equals(user._id).populate("car").exec((error, comments) => {
            if (error) {
                request.flash("error", "Something went wrong.");
                return response.redirect("/");
            }
            console.log(comments);
            response.render("users/show.ejs", { user: user, comments: comments });
        });
    });
});

module.exports = router;

