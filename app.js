var fs = require('fs'),
    dbFile = __dirname + '/bookmarks.sql',
    exists = fs.existsSync(dbFile),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database(dbFile);

var express = require('express'),
    app = new express();

var request = require('request');

db.serialize(function() {
  if (!exists) {
    console.log('Creating database structure...');
    db.run('CREATE TABLE bookmarks (url TEXT, title TEXT)');
  }
});

app.engine('html', require('ejs').renderFile);
app.locals.title = 'Bookmarks';

app.use(express.favicon(__dirname + '/favicon.ico', { maxAge: 6000000 }));
app.use(express.static(__dirname + '/static', { maxAge: 6000000 }));

app.get('/clear', function(req, res) {
  db.run('DELETE FROM bookmarks');
  res.render('cleared.ejs');
});

app.get('/remove', function(req, res) {
  var item = unescape(req.query.item);
  //console.log(item);
  removeFromDB(item);
  res.end();
});

app.get('/*', function(req, res) {
  var urlList = [],
      url = req.originalUrl.slice(1);

  if (url.length !== 0) {
    fetchPageTitle(url, function() {
      var pageTitle = this;
      res.render('added.ejs', {url:url, pageTitle:pageTitle});
    });
  } else {
    db.each('SELECT url, title FROM bookmarks', function(err, row) {
      if (err) {
        res.send('<h3>An Error has occurred!</h3>');
      } else {
        urlList.push([row.url, row.title]);
      }
    }, function() {
      res.render('index.ejs', {urlList:urlList});
    });
  }
});

function addToDB(url, pageTitle) {
  db.run('INSERT INTO bookmarks VALUES (?,?)', url, pageTitle);
}

function removeFromDB(item) {
  db.run('DELETE FROM bookmarks WHERE title = (?)', item);
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
