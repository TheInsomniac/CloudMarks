var Datastore = require('nedb'),
    db = new Datastore({
      filename: __dirname + '/bookmarks.db',
      autoload: true
    });

var express = require('express'),
    app     = new express();

var request = require('request');

app.set('view engine', 'ejs');
app.set('view options', {layout:false});
app.locals.title = 'CloudMarks';

app.use(express.favicon(__dirname + '/favicon.ico', { maxAge: 6000000 }));
app.use(express.static(__dirname + '/static', { maxAge: 6000000 }));

app.get('/clear', function(req, res) {
  db.remove({}, {multi: true});
  res.send('Cleared');
});

app.get('/remove', function(req, res) {
  var item = req.query.item;
  removeFromDB(item);
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

function fetchPageTitle(url, callback) {
  var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g;

  request(url, function(err, res, body) {
    if (err) {
      callback.call(null);
    }
    var match = re.exec(body);
    if (match && match[2]) {
      addToDB(url, match[2]);
      callback.call(match[2]);
    } else {
      addToDB(url, url);
      callback.call(url);
    }
  });
}

app.listen(3000);
