var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Comment = require("../models/comment");

router.get("/users/:id", (request, response) => {
    User.findById(request.params.id, function (err, user) {
        if (err) {
            request.flash("error", "Something went wrong.");
            return response.redirect("/");
        }
        Comment.find().where('author.id').equals(user._id).exec((error, comments) => {
            if(error) {
              request.flash("error", "Something went wrong.");
              return response.redirect("/");
            }
        response.render("users/show.ejs", {user: user, comments: comments});
        });
    });
});

module.exports = router;

