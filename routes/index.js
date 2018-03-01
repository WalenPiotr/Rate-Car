var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

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


router.use((request, response, next) => {
    response.locals.currentUser = request.user;
    response.locals.error = request.flash("error");
    response.locals.success = request.flash("success");
    next();
});

router.get("/", (request, response) => {
    response.render("landing.ejs");
});

router.get("/register", (request, response) => {
    response.render("register.ejs");
});

router.post("/register", (request, response) => {
    async.waterfall(
        [
            (callback) => {
                crypto.randomBytes(20, (error, buffer) => {
                    var token = buffer.toString("hex");
                    console.log(token)
                    callback(error, token);
                });
            },

            (token, callback) => {
                var user = new User({
                    username: request.body.username,
                    email: request.body.email,
                    activationToken: token,
                });

                User.register(user, request.body.password, function (error, user) {
                    if (error) {
                        console.log(error);
                        return response.render("register.ejs");
                    }
                    callback(error, token, user);
                });
            },

            (token, user, callback) => {
                var smtpTransport = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: "321placeholder123@gmail.com",
                        pass: process.env.MAILPASSWORD
                    },

                });
                var mailOptions = {
                    to: user.email,
                    from: "321placeholder123@gmail.com",
                    subject: "Rate Car Account Activation",
                    text: "You are receiving this because you (or someone else) have created new account on RateCar.\n\n" +
                        "Please click on the following link, or paste this into your browser to activate account:\n\n" +
                        "http://" + request.headers.host + "/register/" + token + "\n\n" +
                        "If you did not request this, please ignore this email.\n"
                }
                smtpTransport.sendMail(mailOptions, error => {
                    console.log("Mail sent");
                    request.flash("success", "An e-mail has been sent to " + user.email + " with further instructions.");
                    response.redirect("/cars");
                    callback(error, "done");
                });
            }
        ]
    );



});

router.get("/register/:token", (request, response) => {
    console.log(request.params.token);
    User.findOneAndUpdate({ activationToken: request.params.token }, { isActivated: true }, (error, user) => {
        if (error) {
            console.log(error);
            response.redirect("/");
        } else {
            request.flash("success", "Your account has been activated.");
            response.redirect("/cars");
            // passport.authenticate("local")(request, response, () => {
            //     request.flash("success", "You have been successfully registered and logged in.");
            //     response.redirect("/cars");
            // });
        }
    });
});

router.get("/login", (request, response) => {
    response.render("login.ejs");
});


router.post("/login", passport.authenticate("local", {
    successRedirect: "/cars",
    failureRedirect: "/login",
    successFlash: 'Welcome to RateCar!',
    failureFlash: 'Invalid username or password.'
}), (request, response) => {
}
);

router.get("/logout", (request, response) => {
    request.flash("success", "You have been successfully logged out!");
    request.logout();
    response.redirect("/cars");
});

router.get('/forgot', (request, response) => {
    response.render('forgot.ejs');
});

router.post("/forgot", (request, response, next) => {
    async.waterfall([
        (callback) => {
            crypto.randomBytes(20, (error, buffer) => {
                var token = buffer.toString("hex");
                console.log(token)
                callback(error, token);
            });
        },
        (token, callback) => {
            User.findOne({ email: request.body.email }, (error, user) => {
                if (!user) {
                    request.flash("error", "No account with that email address exists.");
                    return response.redirect('/cars');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 60 * 60 * 1000 // 1 hour in ms
                user.save((error) => {
                    callback(error, token, user);
                });
            })
        },
        (token, user, callback) => {
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "321placeholder123@gmail.com",
                    pass: process.env.MAILPASSWORD
                },

            });
            var mailOptions = {
                to: user.email,
                from: "321placeholder123@gmail.com",
                subject: "Rate Car Password Reset",
                text: "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
                    "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
                    "http://" + request.headers.host + "/reset/" + token + "\n\n" +
                    "If you did not request this, please ignore this email and your password will remain unchanged.\n"
            }
            smtpTransport.sendMail(mailOptions, error => {
                console.log("Mail sent");
                request.flash("success", "An e-mail has been sent to " + user.email + " with further instructions.");
                callback(error, "done");
            });
        }
    ], error => {
        if (error) {
            console.log(error);
            return next(error);
        }
        response.redirect("/cars");
    });
});

router.get("/reset/:token", (request, response) => {
    User.findOne({ resetPasswordToken: request.params.token, resetPasswordExpires: { $gt: Date.now() } }, (error, user) => {
        if (!user) {
            request.flash("error", "Password reset token is invalid or has expired.");
            return response.redirect("/forgot");
        }
        response.render("reset.ejs", { token: request.params.token });
    });
});

router.post("/reset/:token", (request, response) => {
    async.waterfall([
        (callback) => {
            User.findOne({ resetPasswordToken: request.params.token, resetPasswordExpires: { $gt: Date.now() } }, (error, user) => {
                if (!user) {
                    request.flash("error", 'Password reset token is invalid or has expired.');
                    return response.redirect('back');
                }
                if (request.body.password === request.body.confirm) {
                    user.setPassword(request.body.password, (error) => {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                        user.save((error) => {
                            request.logIn(user, (err) => {
                                callback(err, user);
                            });
                        });
                    })
                } else {
                    request.flash("error", "Passwords do not match.");
                    return response.redirect('back');
                }
            });
        },
        (user, callback) => {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: '321placeholder123@gmail.com',
                    pass: process.env.MAILPASSWORD
                }
            });
            var mailOptions = {
                to: user.email,
                from: '321placeholder123@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, (error) => {
                request.flash('success', 'Success! Your password has been changed.');
                callback(error);
            });
        }
    ], (error) => {
        response.redirect('/cars');
    });
});

module.exports = router;