console.log("Spirit Looks Server started");

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  if(Object.keys(req.query).length === 0){
    res.send("Index");
  }else if(typeof req.query.q == "undefined"){
    res.redirect(301, '/');
  }else{
    res.send('Hello World');
  }

})

var server = app.listen(8083, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Spirit Looks app listening at http://%s:%s", host, port)
})
