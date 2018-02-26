var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

router.use(require("express-session")({
    secret: "Sarna to fajny zwierz",
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var flash = require("connect-flash");
router.use(flash());

router.use(function (request, response, next) {
    response.locals.currentUser = request.user;
    response.locals.error = request.flash("error");
    response.locals.success = request.flash("success");
    next();
});

router.get("/", function (request, response) {
    response.render("landing.ejs");
});

router.get("/register", function (request, response) {
    response.render("register.ejs");
});

router.post("/register", function (request, response) {
    User.register(new User({ username: request.body.username}), request.body.password, function (error, user) {
        if (error) {
            return response.render("register.ejs");
        }
        passport.authenticate("local")(request, response, function () {
            response.redirect("/cars");
        });
    });
});

router.get("/login", function (request, response) {
    response.render("login.ejs");
});


router.post("/login", passport.authenticate("local", { successRedirect: "/cars", failureRedirect: "/login" }), function (request, response) {
}
);

router.get("/logout", function (request, response) {
    request.logout();
    response.redirect("/cars");
});



module.exports = router;