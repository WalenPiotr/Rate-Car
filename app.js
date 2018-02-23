var express = require("express");
var app = express()

var mongoose = require("mongoose");
mongoose.connect(process.env.DBURL);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

var methodOverride = require("method-override");
app.use(methodOverride("_method"));

var Car = require("./models/car.js");

app.get("/", function (request, response) {
    response.render("landing.ejs");
});

var seed = require("./seeds.js");
seed();

app.get("/cars", function (request, response) {
    
    response.render("cars/index.ejs");

    // if (request.query.search) {
    //     const regex = new RegExp(escapeRegex(request.query.search), 'gi');
    //     Brand.find({ "name": regex }, function (error, brands) {
    //         if (error) {
    //             console.error(error)
    //         } else {
    //             response.render("brands/index.ejs", { brands: brands });
    //         }
    //     });
    // } else {
    //     Brand.find({}, function (error, brands) {
    //         if (error) {
    //             console.error(error)
    //         } else {
    //             response.render("brands/index.ejs", { brands: brands });
    //         }
    //     });
    // }
});

// app.get("/cars/new", function (request, response) {
//     response.render("brands/new.ejs");
// })

// app.post("/cars", function (request, response) {
//     Brand.create({ name: request.body.name }, function (error, brand) {
//         if (error) {
//             console.error(error);
//         } else {
//             console.log(brand);
//         }
//     })
//     response.redirect("/brands");
// });

// app.delete("/cars/:id", function (request, response) {

//     Brand.findByIdAndRemove(request.params.id, function (error) {
//         if (error) {
//             console.error(error);
//         }
//         response.redirect("/brands");
//     });
// });


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Server has started on: ");
    console.log("PORT: " + process.env.PORT);
    console.log("IP: " + process.env.IP);
});


