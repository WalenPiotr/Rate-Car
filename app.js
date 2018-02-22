var express = require("express");
var app = express()

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/RateCar");


app.use(express.static(__dirname + "/public"));

var brandSchema = new mongoose.Schema({
    name: String,
});

var modelSchema = new mongoose.Schema({

});

Brand = mongoose.model("Brand", brandSchema);

// brandNames = ["BMW", "Audi", "Mercedes"];
// console.log(brandNames);
// brandNames.forEach(function (name) {
//     var brand = new Brand({ name: name });
//     brand.save(function (error) {
//         console.error(error);
//     });
// });

app.get("/", function (request, response) {
    response.render("landing.ejs");
});

app.get("/brands", function (request, response) {
    Brand.find({}, function (error, brands) {
        if (error) {
            console.error(error)
        } else {
            console.log(brands);
            response.render("brands.ejs", { brands: brands });
        }
    });
});

app.get("/brands/new", function (request, response) {
    response.render("new.ejs", { brands: brands });
})

app.post("/brands", function (request, response) {
    response.redirect("/brands");
});




app.get("/models", function (req, res) {
    res.render("models.ejs");
});

app.listen(8888, "127.0.0.1", function () {
    console.log("Server has started on: ");
    console.log("PORT: " + process.env.PORT);
    console.log("IP: " + process.env.IP);
});


