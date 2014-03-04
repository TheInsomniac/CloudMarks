var Datastore = require('nedb'),
  db = new Datastore({
    filename: __dirname + '/bookmarks.db',
    autoload: true
  });

// Auto compact database every 24 hours
var compactInterval = 3600000 * 24; // milliseconds in hours * num hours
db.persistence.setAutocompactionInterval(compactInterval);

var express = require('express'),
  app = new express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  request = require('request');

/* Reduce Socket.IO Logging */
io.set('log level', 1);

app.set('view engine', 'ejs');
app.set('view options', {
  layout: false
});

/* App Title for Index Page */
app.locals.title = 'CloudMarks';

/* If using Apache or NGINX simple http auth and need a way to log out
   A "Logout" button will appear on the index page if 'true' */
app.locals.httpAuth = false;

app.use(express.favicon(__dirname + '/favicon.ico', {
  maxAge: 6000000
}));
app.use(express.static(__dirname + '/static', {
  maxAge: 6000000
}));

/* Truncate string at specified length or closest word boundary + ...
   usage: mystring.trunc(78,true); */
String.prototype.trunc =
  function (n, useWordBoundary) {
    var tooLong = this.length > n,
      s_ = tooLong ? this.substr(0, n - 1) : this;
    s_ = useWordBoundary && tooLong ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
    return tooLong ? s_ + '&hellip;' : s_;
};

/* Add page to Database if in format :
 * http://Cloudmarks.net/http://sitetoadd.com
 * Else display index page */
app.get('/*', function (req, res) {
  var url = req.originalUrl.slice(1);
  if (url.length) {
    fetchPageTitle(url, function () {
      var pageTitle = this;
      res.render('added.ejs', {
        url: url,
        pageTitle: pageTitle
      });
    });
  } else {
    res.render('index.ejs');
  }
});

/* Add new items to database and emit new item to page */
function addItem(url, pageTitle) {
  var d = new Date();
  d = d.toString();
  var data = {
    date: d,
    url: url,
    title: pageTitle
  };
  db.insert(data);
  io.sockets.emit('added', data);
}

/* Remove item from database and emit remove item from page */
function removeItem(item) {
  db.remove({
    _id: item
  }, {});
  io.sockets.emit('removed', item);
}

/* Edit Page title in Database and emit change to page */
function editItem(item, title) {
  db.update({
    _id: item
  }, {
    $set: {
      title: title
    }
  }, {});
  io.sockets.emit('edited', {
    item: item,
    title: title
  });
}

/* Clear All entries in Database and emit clear page */
function clearAll() {
  db.remove({}, {
    multi: true
  });
  io.sockets.emit('cleared', null);
}

/* Fetch page title on add. If not available, return URL
 * Truncates Title to 77 characters + elipses */
function fetchPageTitle(url, callback) {
  var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g;

  request(url, function (err, res, body) {
    if (err) {
      callback.call(null);
    }
    var match = re.exec(body);
    if (match && match[2]) {
      if (match[2].length > 81) {
        match[2] = match[2].trunc(77, true);
      }
      addItem(url, match[2]);
      callback.call(match[2]);
    } else {
      addItem(url, url);
      callback.call(url);
    }
  });
}

/* Socket.IO Functions */
io.sockets.on('connection', function (socket) {
  db.find({}, function (err, urlList) {
    urlList.sort(function (a, b) {
      var c = new Date(a.date),
        d = new Date(b.date);
      return d - c;
    });
    socket.emit('init', urlList);
  });
  socket.on('removeItem', function(id) {
    removeItem(id);
  });
  socket.on('editItem', function(data) {
    var item = data.item;
    var title = data.title;
    editItem(item, title);
  });
  socket.on('clearAll', function() {
    clearAll();
  });
});

/* Start server on port 3000 */
server.listen(3000);
