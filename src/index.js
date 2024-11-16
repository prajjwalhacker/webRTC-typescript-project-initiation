var express = require('express');
var dotenv = require('dotenv');
var app = express();
dotenv.config();
app.get('/', function () {
    console.log('typescipt server with exporess');
});
app.listen(process.env.PORT, function () {
    console.log("server running on port ".concat(process.env.PORT));
});
