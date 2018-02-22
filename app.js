var express = require("express")

var app = express()

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started on: ");
    console.log("PORT: " + process.env.PORT);
    console.log("IP: " + process.env.IP);
});
