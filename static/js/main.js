(function() {
  var clearAll = document.getElementsByClassName('clear-all')[0];
  clearAll.addEventListener('click', function(event) {
    httpGet(window.location.href + "clear");
    location.reload();
  });

  var remove = Array.prototype.slice.call(document.getElementsByClassName('remove'));
  remove.forEach(function(el) {
  // Add event listener
    el.addEventListener('click', function(event) {
      var toRemove = window.location.href + "remove?item=" + el.parentElement.children[2].id;
      //var toRemove = window.location.href + "remove?item=" + el.parentElement.children[1].name;
      httpGet(toRemove);
      location.reload();
    });
  });

  var edit = Array.prototype.slice.call(document.getElementsByClassName('edit'));
    edit.forEach(function(el) {
      el.addEventListener('click', function(event) {
        item = el.parentElement.children[2];
        if (!item.hasAttribute('contenteditable')) {
          item.setAttribute('contenteditable', 'true');
          item.addEventListener('keydown', function (event) {
            var esc = event.which == 27,
                nl = event.which == 13,
                el = event.target,
                input = el.nodeName != 'INPUT' && el.nodeName != 'TEXTAREA',
                data = [];

            if (input) {
              if (esc) {
                // restore state
                document.execCommand('undo');
                el.blur();
                el.removeAttribute('contenteditable');
              } else if (nl) {
                // save
                data = [el.getAttribute('id'), el.innerHTML];
                el.removeAttribute('contenteditable');

                // ajax request to update the field
                var toEdit = window.location.href + "edit?item=" + data[0] + "&title=" + data[1];
                httpGet(toEdit);

                el.blur();
                event.preventDefault();
              }
            }
          }, true);
        } else {
          item.removeAttribute('contenteditable');
        }
      });
    });
}());

  function httpGet(theUrl) {
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
