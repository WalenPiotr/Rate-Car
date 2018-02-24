var mongoose = require("mongoose");
var Car = require("./models/car.js")

cars = [
    {brand: "BMW", model: "X3", description: "Bacon ipsum dolor amet chicken flank t-bone, pork belly picanha leberkas porchetta. Swine filet mignon chicken kielbasa, ball tip kevin cow shoulder pork chop bresaola. Short ribs shoulder ribeye ground round. Kevin bacon jerky porchetta, filet mignon ham flank turducken buffalo rump capicola. Pork loin short loin beef, pork fatback ham jerky pancetta chuck pork belly bresaola leberkas."},
    {brand: "BMW", model: "X4", description: "Filet mignon burgdoggen short loin, meatball landjaeger pork chop shank turducken sausage beef ribs ham hock. Pastrami cupim t-bone porchetta brisket. Brisket ribeye rump pork capicola shankle. Drumstick frankfurter sausage t-bone. Drumstick rump beef ribs short ribs bresaola shank pancetta sausage picanha burgdoggen cupim jowl pork loin. Burgdoggen sausage short ribs pancetta beef ribs drumstick bresaola."},
    {brand: "BMW", model: "X5", description: "Spare ribs ham hock corned beef chicken, turkey tongue sausage kevin. Cow kevin pastrami meatball pork belly picanha tenderloin, capicola turducken. Fatback boudin bacon porchetta, shankle beef ribs cupim meatloaf pork. Biltong beef pig doner rump tongue ribeye strip steak tail porchetta. T-bone kielbasa swine pastrami frankfurter. Short loin alcatra bresaola, kevin ham hock shankle tongue ham shoulder."},
    {brand: "Audi", model: "A3", description: "Spare ribs ham hock corned beef chicken, turkey tongue sausage kevin. Cow kevin pastrami meatball pork belly picanha tenderloin, capicola turducken. Fatback boudin bacon porchetta, shankle beef ribs cupim meatloaf pork. Biltong beef pig doner rump tongue ribeye strip steak tail porchetta. T-bone kielbasa swine pastrami frankfurter. Short loin alcatra bresaola, kevin ham hock shankle tongue ham shoulder."},
    {brand: "Audi", model: "A2", description: "Spare ribs ham hock corned beef chicken, turkey tongue sausage kevin. Cow kevin pastrami meatball pork belly picanha tenderloin, capicola turducken. Fatback boudin bacon porchetta, shankle beef ribs cupim meatloaf pork. Biltong beef pig doner rump tongue ribeye strip steak tail porchetta. T-bone kielbasa swine pastrami frankfurter. Short loin alcatra bresaola, kevin ham hock shankle tongue ham shoulder."},
    {brand: "Audi", model: "A4", description: "Spare ribs ham hock corned beef chicken, turkey tongue sausage kevin. Cow kevin pastrami meatball pork belly picanha tenderloin, capicola turducken. Fatback boudin bacon porchetta, shankle beef ribs cupim meatloaf pork. Biltong beef pig doner rump tongue ribeye strip steak tail porchetta. T-bone kielbasa swine pastrami frankfurter. Short loin alcatra bresaola, kevin ham hock shankle tongue ham shoulder."}
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