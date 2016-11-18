console.log("Spirit Looks Server started");

var express = require('express');
var fs = require('fs');
var mustache = require('mustache');
var app = express();

var customTags = [ '<%', '%>' ];
mustache.tags = customTags;

function sendHomePage(vars,res){

  fs.readFile('home-view.html', 'utf8', function (err,data) {

    var rendered = mustache.render(data, vars);

    res.send(rendered);

  });

}

app.get('/', function (req, res) {
  if(Object.keys(req.query).length === 0){

    sendHomePage({"init":true},res);

  }else if(typeof req.query.q == "undefined"){

    res.redirect(301, '/');

  }else{

    sendHomePage({"init":false},res);

  }

})

var server = app.listen(8083, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Spirit Looks app listening at http://%s:%s", host, port)
})
