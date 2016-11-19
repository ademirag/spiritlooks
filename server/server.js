console.log("Spirit Looks Server started");

var express = require('express');
var fs = require('fs');
var mustache = require('mustache');
var app = express();

var appSettings = {
  ajaxMode:true
}

var partials = new Object();

addPartial("init","views/init.mustache");
addPartial("main","views/main.mustache");

app.use(express.static('public'));

var customTags = [ '<%', '%>' ];
mustache.tags = customTags;

function sendHomePage(vars,res){

  vars.appSettings = appSettings;

  fs.readFile('views/home.mustache', 'utf8', function (err,data) {

    var rendered = mustache.to_html(data, vars, partials);

    res.send(rendered);

  });

}

app.get('/', function (req, res) {
  if(Object.keys(req.query).length === 0){

    sendHomePage({"query":null},res);

  }else if(typeof req.query.q == "undefined"){

    res.redirect(301, '/');

  }else{

    sendHomePage({"query":req.query.q},res);

  }

})

var server = app.listen(8083, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Spirit Looks app listening at http://%s:%s", host, port)
})


function addPartial(name,filepath){
  var data = fs.readFileSync(filepath);
  partials[name] = data.toString();
}
