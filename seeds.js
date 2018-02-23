var mongoose = require("mongoose");
var Car = require("./models/car.js")

cars = [
    {brand: "BMW", model: "X3"},
    {brand: "BMW", model: "X4"},
    {brand: "BMW", model: "X5"},
    {brand: "Audi", model: "A3"},
    {brand: "Audi", model: "A2"},
    {brand: "Audi", model: "A4"}
]

    function seed() {
    Car.remove({},function(error){
        if(error){
            console.error(error);
        } else {
            console.log("Cars removed!")
            cars.forEach(function (car) {
                Car.create(car,function(error, car){
                    if(error) {
                        console.error(error);
                    } else {
                        car.save();
                        console.log("Created new car!")
                    }
                });
            });
        }
    });
}

module.exports = seed;