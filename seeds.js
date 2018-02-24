var mongoose = require("mongoose");
var Car = require("./models/car.js");
var Comment = require("./models/comment.js");
cars = [
    {
        brand: "BMW", 
        model: "X3", 
        description: "Bacon ipsum dolor amet chicken flank t-bone, pork belly picanha leberkas porchetta. Swine filet mignon chicken kielbasa, ball tip kevin cow shoulder pork chop bresaola. Short ribs shoulder ribeye ground round. Kevin bacon jerky porchetta, filet mignon ham flank turducken buffalo rump capicola. Pork loin short loin beef, pork fatback ham jerky pancetta chuck pork belly bresaola leberkas.",
    },
    {
        brand: "FSO", 
        model: "Polonez", 
        description: "Bacon ipsum dolor amet chicken flank t-bone, pork belly picanha leberkas porchetta. Swine filet mignon chicken kielbasa, ball tip kevin cow shoulder pork chop bresaola. Short ribs shoulder ribeye ground round. Kevin bacon jerky porchetta, filet mignon ham flank turducken buffalo rump capicola. Pork loin short loin beef, pork fatback ham jerky pancetta chuck pork belly bresaola leberkas.",

    },
    {
        brand: "Audi", 
        model: "A3", 
        description: "Bacon ipsum dolor amet chicken flank t-bone, pork belly picanha leberkas porchetta. Swine filet mignon chicken kielbasa, ball tip kevin cow shoulder pork chop bresaola. Short ribs shoulder ribeye ground round. Kevin bacon jerky porchetta, filet mignon ham flank turducken buffalo rump capicola. Pork loin short loin beef, pork fatback ham jerky pancetta chuck pork belly bresaola leberkas.",

    },
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