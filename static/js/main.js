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

  window.onload = function () {
    var clearAll = document.getElementsByClassName('clearAll')[0];
    clearAll.addEventListener('click', function (event) {
      //httpGet(window.location.href + "clear");
      socket.emit('clearAll', null);
      location.reload();
    });
  };
