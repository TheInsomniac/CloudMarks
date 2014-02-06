var Datastore = require('nedb'),
    db = new Datastore({
      filename: __dirname + '/bookmarks.db',
      autoload: true
    });

// Auto compact database every 24 hours
var compactInterval = 3600000 * 24; // milliseconds in hours * num hours
db.persistence.setAutocompactionInterval(compactInterval);

var express = require('express'),
    app     = new express();

var request = require('request');

app.set('view engine', 'ejs');
app.set('view options', {layout:false});
app.locals.title = 'CloudMarks';

app.use(express.favicon(__dirname + '/favicon.ico', { maxAge: 6000000 }));
app.use(express.static(__dirname + '/static', { maxAge: 6000000 }));

/* Truncate string at specified length or closest word boundary + ...
   usage: mystring.trunc(78,true); */
String.prototype.trunc =
  function(n,useWordBoundary){
    var tooLong = this.length>n,
        s_ = tooLong ? this.substr(0,n-1) : this;
    s_ = useWordBoundary && tooLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
    return  tooLong ? s_ + '&hellip;' : s_;
  };

app.get('/clear', function(req, res) {
  db.remove({}, {multi: true});
  res.send('Cleared');
});

app.get('/remove', function(req, res) {
  var item = req.query.item;
  removeFromDB(item);
  res.end();
});

app.get('/edit', function(req, res) {
  var item = req.query.item,
      title = req.query.title;
  editItem(item, title);
  res.end();
});

app.get('/*', function(req, res) {
  var urlList = [],
      url = req.originalUrl.slice(1);

  if (url.length) {
    fetchPageTitle(url, function() {
      var pageTitle = this;
      res.render('added.ejs', {url:url, pageTitle:pageTitle});
    });
  } else {
    db.find({}, function(err, urlList) {
      if (err) {
        res.send('<h3>An Error has occurred!</h3>');
      } else {
      res.render('index.ejs', {urlList:urlList});
      }
    });
  }
});

function addToDB(url, pageTitle) {
 db.insert({url:url, title:pageTitle});
}

function removeFromDB(item) {
  db.remove({_id:item}, {});
}

function editItem(item, title) {
  db.update({_id:item}, {$set:{title:title}}, {});
}

function fetchPageTitle(url, callback) {
  var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g;

  request(url, function(err, res, body) {
    if (err) {
      callback.call(null);
    }
    var match = re.exec(body);
    if (match && match[2]) {
      if (match[2].length > 81) {
        match[2] = match[2].trunc(77,true);
      }
      addToDB(url, match[2]);
      callback.call(match[2]);
    } else {
      addToDB(url, url);
      callback.call(url);
    }
  });
}

app.listen(3000);
