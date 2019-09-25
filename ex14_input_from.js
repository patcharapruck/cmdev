var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}))
//app.use(bodyParser.json())

app.get('/*',function(req,res){
    res.sendFile(path.join(__dirname,"/pubilc/login.html"));
});

app.post('/authen',function(req,res){
    res.json({username: req.body.username, password: req.body.password}); 
});

var server = app.listen(3000 , function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Listening at http://%s:%s",host,port);
});