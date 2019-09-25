var express = require('express');
var app = express();
var session = require('express-session');

app.use(session({
    secret: 'codemobiles', cookie: {maxAge:6000000},
    resave:true,saveUninitiallzed:false
}));

app.get("/count",function(req,res){
    if(req.session.count == null){
        req.session.count = 0;
    }

    req.session.count = req.session.count + 1;
    //res.send("count: " + req.session.count);

    res.setHeader("Content-Type","text/html");
    res.write(`<b><font color='#FF0000'>Count ${req.session.count}</font></b>`);
    res.end();
});

app.get("/reset",function(req,res){

    // reset
    //req.session.count = 0;
    //res.send("count: " + req.session.count);

    //remove
    req.session.destroy();
    res.redirect('/count');
});


var server = app.listen(3000 , function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Listening at http://%s:%s",host,port);
});