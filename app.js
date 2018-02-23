var express = require("express");
var app = express()

var mongoose = require("mongoose");
mongoose.connect(process.env.DBURL);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

var Model = require("./models/model");
var Brand = require("./models/brand");

app.get("/", function (request, response) {
    response.render("landing.ejs");
});

app.get("/brands", function (request, response) {
    if (request.query.search) {
        const regex = new RegExp(escapeRegex(request.query.search), 'gi');
        Brand.find({ "name": regex }, function (error, brands) {
            if (error) {
                console.error(error)
            } else {
                response.render("brands/index.ejs", { brands: brands });
            }
        });
    } else {
        Brand.find({}, function (error, brands) {
            if (error) {
                console.error(error)
            } else {
                response.render("brands/index.ejs", { brands: brands });
            }
        });
    }
});

app.get("/brands/new", function (request, response) {
    response.render("brands/new.ejs");
})

app.post("/brands", function (request, response) {
    Brand.create({ name: request.body.name }, function (error, brand) {
        if (error) {
            console.error(error);
        } else {
            console.log(brand);
        }
    })
    response.redirect("/brands");
});

app.get("/brands/:id", function (request, response) {

    if (request.query.search) {
        const regex = new RegExp(escapeRegex(request.query.search), 'gi');
        Brand.findById(request.params.id).populate({ path: "models", match: { name: { $regex: regex } } }).exec(function (error, brand) {
            if (error) {
                console.error(error);
            } else {
                response.render("models/index.ejs", { brand: brand });
            }
        });
    } else {
        Brand.findById(request.params.id).populate({ path: "models" }).exec(function (error, brand) {
            if (error) {
                console.error(error);
            } else {
                response.render("models/index.ejs", { brand: brand });
            }
        });
    }

});

app.get("/brands/:id/new", function (request, response) {
    Brand.findById(request.params.id, function (error, brand) {
        response.render("models/new.ejs", { brand: brand });
    });
});

app.post("/brands/:id/", function (request, response) {
    Brand.findById(request.params.id, function (error, brand) {
        if (error) {
            console.error(error);
        } else {
            Model.create({ name: request.body.name }, function (error, model) {
                if (error) {
                    console.error(error);
                } else {
                    brand.models.push(model._id);
                    brand.save();
                    response.redirect("/brands/" + request.params.id);
                }
            });
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Server has started on: ");
    console.log("PORT: " + process.env.PORT);
    console.log("IP: " + process.env.IP);
});


