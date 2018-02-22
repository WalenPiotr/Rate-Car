var express = require("express");
var app = express()

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/RateCar");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));


var modelSchema = new mongoose.Schema({
    name: String,
});

var brandSchema = new mongoose.Schema({
    name: String,
    models: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Model' }]
});

Model = mongoose.model("Model", modelSchema);
Brand = mongoose.model("Brand", brandSchema);

brandNames = ["BMW", "Audi", "Mercedes"];
Brand.remove({},function(error){
    if(error){
        console.error(error);
    } else {
        console.log("Brands removed")
        Model.remove({},function(error){
            if(error){
                console.error(error);
            } else {
                console.log("Models removed")
                brandNames.forEach(function (brandName) {
                    Brand.create({name: brandName},function(error, brand){
                        if(error) {
                            console.error(error);
                        } else {
                            Model.create({name: "modelName"}, function(error, model){
                                brand.models.push(model._id);
                                brand.save();
                                console.log("Create new brand and model")
                            });            
                        }
                    });
                });
            }
        });
    }
});

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
    response.render("new.ejs");
})

app.post("/brands", function (request, response) {
    Brand.create({name: request.body.name}, function(error, brand){
        if(error){
            console.error(error);
        } else {
            console.log(brand);
        }
    })
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


