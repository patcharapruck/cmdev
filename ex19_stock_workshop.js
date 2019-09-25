var express = require('express');
var formidable = require('formidable');
var path = require('path');
var app = express();
var sqlite3 = require('sqlite3');
var fs = require('fs');

var app = express();
app.use(express.static(path.join(__dirname,'/stock')))

// set template engine
app.set('view engine', 'ejs');
app.set('views', './stock')

app.get('/',function(req,res){

  //   var dummy_products = [];
  // // Make Dummy Data
  //   for (var i = 1; i <= 100; i++) {
  //       dummy_products.push({ id: i, image: "/images/ink_wrt.png", title: "Ink", description: "รายละเอียด", price: 1000, stock: 100 })
  //   }  
  // console.log(JSON.stringify(dummy_products));

  queryData(function (result) {
    res.render("index", { header: "Stock Workshop", products: result });
  });
    
});

app.get('/add',function(req,res){
    res.render("add", {header:"Create Products"})
});

app.get('/edit',function(req,res){

  //var row = {image: "1568953648184.jpg",title:"ink wrt",description: "ink",price: 100000,stock: 10}
  queryByID(req.query.id,function(row){
    res.render("edit", {header:"Edit Products",item: row})
  })
  
});

app.post('/api/add', function (req, res) {

    try {
      var form = new formidable.IncomingForm();
      var newname = Date.now();
      form.parse(req, function (err, fields, files) {

        var oldpath = files.filetoupload.path;
        var fileName = newname.toString() + "." + files.filetoupload.name.split('.').pop();
        var newpath = path.join(__dirname, "./stock/images/" + fileName);
        fs.rename(oldpath, newpath, function (err) {
          if (err) throw err;
  
          var data = {
            title: fields.title,
            description: fields.description,
            price: fields.price,
            stock: fields.stock,
            image: fileName
          }
  
          insertData(data);
  
          //res.end("Insert Data: " + JSON.stringify(data));
          res.redirect("/");

        // #8
          // res.write("files: " + JSON.stringify(files));
          // res.write("fields: " + JSON.stringify(fields));
          // res.end();
  
        });
  
      });
    } catch (err) {
      console.log("err : " + err);
      res.json(err);
    }
  });

  app.post('/api/update', function (req, res) {

    try {
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        if (files.filetoupload.size != 0) {
  
          var oldpath = files.filetoupload.path;
          var newpath = path.join(__dirname, "./stock/images/" + fields.image);
  
          fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            console.log("Update file successfully");
          });
        }
        var data = {
          id: fields.id,
          title: fields.title,
          description: fields.description,
          price: fields.price,
          stock: fields.stock      
        }
        console.log("update: " + JSON.stringify(data))
        updateData(data);
        res.redirect('/');
      });
    } catch (err) {
  
    }
  });

  app.get('/api/delete', function(req, res){
    deleteRow(req.query.id, function(){
      res.redirect('/');
    });
  });

  // Error Handler
  app.use(function (req, res, error) {
    console.log("error: " + JSON.stringify(error));
    res.redirect('/')
  //res.sendFile(path.join(__dirname, "/stock/404.html"));
  
  })

  function queryData(callback){

    var db = openDB();

    const sql = "select * from stock order by id";
    db.all(sql, function (err, rows) {
      if (err) {
        callback([])
      } else {
        //console.log(JSON.stringify(rows));
        callback(rows);
      }
    });
  
    closeDB(db);

  }

  function queryByID(id,callback){
    let db = openDB();

    db.get("select * from stock where id=" + id, function (err, row) {
      if (err) throw err;
  
      callback(row);
    });
  
    closeDB(db);
  }

  function insertData(data){
    let db = openDB();
    const sql = `INSERT INTO stock(title, description, price, stock, image) 
    VALUES('${data.title}',
         '${data.description}',
          ${data.price},
          ${data.stock},
          '${data.image}')`;

    console.log(sql);
    db.run(sql);
    closeDB(db);
  }

  function updateData(data) {
    let db = openDB();
    const sql = `UPDATE stock SET title= '${data.title}',
                 description = '${data.description}', 
                 price = ${data.price}, 
                 stock = ${data.stock} where id='${data.id}'`;
  
    console.log(sql);
    db.run(sql);
    closeDB(db);
  }

  function deleteRow(id, callback){
    var db = openDB();
  
    const sql = `DELETE FROM stock WHERE ID=${id}`;
    db.run(sql, function(err){
      if (err) throw err
  
      callback();
    });
  
    closeDB(db);
  }

  function openDB() {

    let db = new sqlite3.Database(path.join(__dirname, '/stock/data.db'), (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the stock database.');
    });
  
    var sql_create_table = `CREATE TABLE IF NOT EXISTS 'stock' (
          'id'	INTEGER PRIMARY KEY AUTOINCREMENT,
          'title'	TEXT,
          'description'	TEXT,
          'price'	INTEGER,
          'stock'	INTEGER,
          'image' TEXT 
        )`;
  
    db.run(sql_create_table);
    return db;
  }
  
  function closeDB(db) {
    // close the database connection
    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
    });
  }


var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
  
    console.log("Example app listening at http://%s:%s", host, port)
})