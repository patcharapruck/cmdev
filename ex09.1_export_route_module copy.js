var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var app = express();
var router = express.Router();

router.route('/comment')
.get(function(req,res){
    res.end("get comment");
})
.post(function(req,res){
    res.end("post comment");
})
.put(function(req,res){
    res.end("put comment");
})
.delete(function(req,res){
    res.end("delete comment");
});

router.route('/stock')
.get(function(req,res){
    res.end("get stock");
})
.post(function(req,res){
    res.end("post stock");
})
.put(function(req,res){
    res.end("put stock");
})
.delete(function(req,res){
    res.end("delete stock");
});

module.exports = router;
