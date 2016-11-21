
  console.log("Spirit Looks Server started");


var appSettings = {
  ajaxMode:true,
  gurus:[
    {
      keyword:"mevalana",
      title:"MEVLANA CELALEDDİN RUMİ"
    },
    {
      keyword:"mooji",
      title:"MOOJİ"
    },
    {
      keyword:"osho",
      title:"OSHO"
    },
    {
      keyword:"krishnamurti",
      title:"JIDDU KRISHNAMURTI"
    }
  ]
}

var port = 8083;

var express = require('express');
var fs = require('fs');
var mustache = require('mustache');
var app = express();

var partials = new Object();

addPartial("init","views/init.mustache");
addPartial("main","views/main.mustache");

app.use(express.static('public'));

var customTags = [ '<%', '%>' ];
mustache.tags = customTags;

function sendHomePage(vars,res){

  var gurusSorted = appSettings.gurus.slice(0);
  gurusSorted.sort(function(a,b) {
      return a.title > b.title ? 1 : (a.title == b.title ? 0 : -1);
  });

  appSettings.gurusSorted = gurusSorted;

  vars.appSettingsString = JSON.stringify(appSettings);
  vars.appSettings = appSettings;

  fs.readFile('views/home.mustache', 'utf8', function (err,data) {

    var rendered = mustache.to_html(data, vars, partials);

    res.send(rendered);

  });

}

app.get('/', function (req, res) {

// BURASI OK, ON YÜZ DÜŞÜNECEK

  if(Object.keys(req.query).length === 0){

    sendHomePage({"query":null},res);

  }else{

    if(typeof req.query.q == "undefined"){

      sendHomePage({"query":null},res);

    }else{

      sendHomePage({"query":req.query.q,"result":JSON.stringify(search())},res);

    }

  }

});

app.get('/search', function(req,res){
  var rv = new Object();
  rv.result = search();
  rv.error = 0;
  res.send(rv);
});

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Spirit Looks app listening at http://%s:%s", host, port)
})

function search(){
  return [
    {
      "title":"Jiddu Krishnamurti - Kimim ben? ",
      "abstract":"Try watching this video on www.youtube.com, or enable JavaScript if it is ... Hz. Mevlana ... Öfke, Kıskançlık ve Korkuyu Aşmak - Osho; Sevginin Kökleri ... Kitap / DNA'nın On İki Tabakası -; DNA ve Bilinçli Şifa - Sol Luckman ...",
      "link":"kendimlekonusuyorum.blogspot.com/.../jiddu-krishnamurti-kimim-ben-turkce.html"
    },
    {
      "title":"Jiddu Krishnamurti - Kimim ben? ",
      "abstract":"Try watching this video on www.youtube.com, or enable JavaScript if it is ... Hz. Mevlana ... Öfke, Kıskançlık ve Korkuyu Aşmak - Osho; Sevginin Kökleri ... Kitap / DNA'nın On İki Tabakası -; DNA ve Bilinçli Şifa - Sol Luckman ...",
      "link":"kendimlekonusuyorum.blogspot.com/.../jiddu-krishnamurti-kimim-ben-turkce.html"
    },
    {
      "title":"Jiddu Krishnamurti - Kimim ben? ",
      "abstract":"Try watching this video on www.youtube.com, or enable JavaScript if it is ... Hz. Mevlana ... Öfke, Kıskançlık ve Korkuyu Aşmak - Osho; Sevginin Kökleri ... Kitap / DNA'nın On İki Tabakası -; DNA ve Bilinçli Şifa - Sol Luckman ...",
      "link":"kendimlekonusuyorum.blogspot.com/.../jiddu-krishnamurti-kimim-ben-turkce.html"
    },
    {
      "title":"Jiddu Krishnamurti - Kimim ben? ",
      "abstract":"Try watching this video on www.youtube.com, or enable JavaScript if it is ... Hz. Mevlana ... Öfke, Kıskançlık ve Korkuyu Aşmak - Osho; Sevginin Kökleri ... Kitap / DNA'nın On İki Tabakası -; DNA ve Bilinçli Şifa - Sol Luckman ...",
      "link":"kendimlekonusuyorum.blogspot.com/.../jiddu-krishnamurti-kimim-ben-turkce.html"
    },
    {
      "title":"Jiddu Krishnamurti - Kimim ben? ",
      "abstract":"Try watching this video on www.youtube.com, or enable JavaScript if it is ... Hz. Mevlana ... Öfke, Kıskançlık ve Korkuyu Aşmak - Osho; Sevginin Kökleri ... Kitap / DNA'nın On İki Tabakası -; DNA ve Bilinçli Şifa - Sol Luckman ...",
      "link":"kendimlekonusuyorum.blogspot.com/.../jiddu-krishnamurti-kimim-ben-turkce.html"
    },
    {
      "title":"Jiddu Krishnamurti - Kimim ben? ",
      "abstract":"Try watching this video on www.youtube.com, or enable JavaScript if it is ... Hz. Mevlana ... Öfke, Kıskançlık ve Korkuyu Aşmak - Osho; Sevginin Kökleri ... Kitap / DNA'nın On İki Tabakası -; DNA ve Bilinçli Şifa - Sol Luckman ...",
      "link":"kendimlekonusuyorum.blogspot.com/.../jiddu-krishnamurti-kimim-ben-turkce.html"
    },
    {
      "title":"Jiddu Krishnamurti - Kimim ben? ",
      "abstract":"Try watching this video on www.youtube.com, or enable JavaScript if it is ... Hz. Mevlana ... Öfke, Kıskançlık ve Korkuyu Aşmak - Osho; Sevginin Kökleri ... Kitap / DNA'nın On İki Tabakası -; DNA ve Bilinçli Şifa - Sol Luckman ...",
      "link":"kendimlekonusuyorum.blogspot.com/.../jiddu-krishnamurti-kimim-ben-turkce.html"
    },
    {
      "title":"Jiddu Krishnamurti - Kimim ben? ",
      "abstract":"Try watching this video on www.youtube.com, or enable JavaScript if it is ... Hz. Mevlana ... Öfke, Kıskançlık ve Korkuyu Aşmak - Osho; Sevginin Kökleri ... Kitap / DNA'nın On İki Tabakası -; DNA ve Bilinçli Şifa - Sol Luckman ...",
      "link":"kendimlekonusuyorum.blogspot.com/.../jiddu-krishnamurti-kimim-ben-turkce.html"
    },
    {
      "title":"Jiddu Krishnamurti - Kimim ben? ",
      "abstract":"Try watching this video on www.youtube.com, or enable JavaScript if it is ... Hz. Mevlana ... Öfke, Kıskançlık ve Korkuyu Aşmak - Osho; Sevginin Kökleri ... Kitap / DNA'nın On İki Tabakası -; DNA ve Bilinçli Şifa - Sol Luckman ...",
      "link":"kendimlekonusuyorum.blogspot.com/.../jiddu-krishnamurti-kimim-ben-turkce.html"
    },
    {
      "title":"Jiddu Krishnamurti - Kimim ben? ",
      "abstract":"Try watching this video on www.youtube.com, or enable JavaScript if it is ... Hz. Mevlana ... Öfke, Kıskançlık ve Korkuyu Aşmak - Osho; Sevginin Kökleri ... Kitap / DNA'nın On İki Tabakası -; DNA ve Bilinçli Şifa - Sol Luckman ...",
      "link":"kendimlekonusuyorum.blogspot.com/.../jiddu-krishnamurti-kimim-ben-turkce.html"
    }
  ]
}

function addPartial(name,filepath){
  var data = fs.readFileSync(filepath);
  partials[name] = data.toString();
}
