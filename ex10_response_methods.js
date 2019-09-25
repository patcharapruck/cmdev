var express = require("express");
var router = require('./ex09.1_export_route_module copy');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname,"/pubilc")));


app.get('/download',function(req,res){
    res.download(path.join(__dirname, '/pubilc/download.jpg'));
});

app.get('/send',function(req,res){
    res.send("Welcome send");
});

app.get('/end',function(req,res){
    res.write("1");
    res.write("2");
    res.write("3");
    res.write("4");
    res.end("5");
});

app.get('/redirect',function(req,res){
    res.redirect('/json');
});

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,"/pubilc/index.html"));
});


app.get('/json',function(req,res){
    var data = {result:"ok", message:"test"}
    res.json(data);
});

var server = app.listen(3000 , function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Listening at http://%s:%s",host,port);
});