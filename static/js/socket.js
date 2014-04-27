/* Change this to the URL for your server if not just running locally */
var socketURL = 'http://localhost:3000';

/* Initialize Socket */
var socket = io.connect(socketURL);

/* On Reconnect remove old container */
socket.on('reconnect', function () {
  console.log('Socket Reconnecting...');
  var container = document.querySelector('.container');
  container.remove();
});

/* On Load build all items, edit and remove buttons */
socket.on('init', function (data) {
  console.log('Socket Connected...');
  var container = document.createElement('div');
  container.setAttribute('class', 'container');
  data.forEach(function (url) {
    var item = document.createElement('div');
    item.setAttribute('class', 'item');
    var remove = document.createElement('div');
    remove.setAttribute('class', 'remove');
    remove.addEventListener('click', removeItem, false);
    item.appendChild(remove);
    var edit = document.createElement('div');
    edit.setAttribute('class', 'edit');
    edit.addEventListener('click', editItem, false);
    item.appendChild(edit);
    var link = document.createElement('a');
    link.href = url.url;
    link.target = '_blank';
    link.name = url._id;
    link.id = url._id;
    link.innerHTML = unescape(url.title);
    item.appendChild(link);
    //container.insertBefore(item, document.querySelector('.clear-all'));
    container.appendChild(item);
  });
  document.body.insertBefore(container, document.querySelector('footer'));
});

/* On Add Item */
socket.on('added', function (url) {
  var container = document.querySelector('.container');
  var item = document.createElement('div');
  item.setAttribute('class', 'item');
  var remove = document.createElement('div');
  remove.setAttribute('class', 'remove');
  remove.addEventListener('click', removeItem, false);
  item.appendChild(remove);
  var edit = document.createElement('div');
  edit.setAttribute('class', 'edit');
  edit.addEventListener('click', editItem, false);
  item.appendChild(edit);
  var link = document.createElement('a');
  link.href = url.url;
  link.target = '_blank';
  link.name = url._id;
  link.id = url._id;
  link.innerHTML = unescape(url.title);
  item.appendChild(link);
  container.insertBefore(item, container.childNodes[0]);
});

/* On Remove Item */
socket.on('removed', function (id) {
  var item = document.getElementById(id);
  item.parentElement.remove();
});

/* On Edit Item */
socket.on('edited', function (data) {
  var item = document.getElementById(data.item);
  item.innerHTML = data.title;
});

/* On Clear All */
socket.on('cleared', function () {
  var container = document.querySelector('.container');
  container.remove();
});

