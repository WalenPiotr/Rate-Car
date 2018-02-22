var mongoose = require("mongoose");
var Model = require("./models/model.js")
var Brand = require("./models/brand.js")

brandNames = ["BMW", "Audi", "Mercedes"];
function seed() {
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
}

module.exports = seed;