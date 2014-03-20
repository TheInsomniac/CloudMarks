  function removeItem() {
    socket.emit('removeItem', this.parentElement.children[2].id);
  }

  function editItem() {
    var item = this.parentElement.children[2];
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

            /* Emit Change Event */
            socket.emit('editItem', {item:data[0], title:data[1]});

            el.blur();
            event.preventDefault();
          }
        }
      }, true);
    } else {
      item.removeAttribute('contenteditable');
    }
  }

	document.addEventListener('paste', function (e) {
		var data;
		e.preventDefault();
		// IE
		if (window.clipboardData) {
			data = window.clipboardData.getData('Text');
		// Standard-compliant browsers
		} else {
			data = e.clipboardData.getData('text');
		}
		//console.log('paste', data);
		httpGet(window.location.href + data);
	});

function httpGet(theUrl) {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

  window.onload = function () {
    var clearAll = document.getElementsByClassName('clearAll')[0];
    clearAll.addEventListener('click', function (event) {
      socket.emit('clearAll', null);
      location.reload();
    });
  };