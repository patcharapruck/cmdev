var express = require("express");
var bodyParser = require("body-parser");
var app = express();

//root path
app.get('/', function(req,res){
    res.end('default');
});

//flx path
app.get('/api/add', function(req,res){
    res.end('/api/add');
});

// ? = optional
//ex; /abcd or / acd
app.get('/ab?cd', function(req,res){
    res.end('/abcd');
});

// + = same...
//ex; /x1cd,x11cd not call if xcd only!
app.get('/x1+cd', function(req,res){
    res.end('/x1+');
});

// * = Any...
//ex; /ab*cd , abferferfefcd
app.get('/ab*cd', function(req,res){
    res.end('/eieiei');
});

var server = app.listen(3000 , function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Listening at http://%s:%s",host,port);
});