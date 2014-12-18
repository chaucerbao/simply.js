var count = 0;

simply.select('#open-modal').addEventListener('click', function(e) {
  e.preventDefault();

  var options = {
    class: 'style-' + (count++ % 3 + 1),
    height: (30 + Math.random() * 50) + '%',
    width: (30 + Math.random() * 50) + '%'
  };

  simply.modal.open('<h1>Inline HTML #' + count + '</h1><p>This is inline HTML</p><a class="modal-close" href="#close">Close</a>', options).then(function(content) {
    console.log('Loaded: ', content);

    /* Attach the close() method to the 'modal-close' class inside the 'content' node */
    simply.select('?.modal-close', content).addEventListener('click', function(e) {
      e.preventDefault();
      simply.modal.close();
    });

    content.on('cancel', function(content) { console.log('Canceled: ', content); });
    content.on('close', function(content) { console.log('Closed: ', content); });
    content.on('resize', function(content) { console.log('Resized: ', content); });
  });
});

var options = {
  class: 'style-1',
  width: '60%',
  height: '60%'
};

/* DOM Element */
simply.select('#open-dom-element').addEventListener('click', function(e) {
  e.preventDefault();
  simply.modal.open('#dom-element', options).then(function(content) {
    simply.select('?.modal-close', content).addEventListener('click', function(e) {
      e.preventDefault();
      simply.modal.close();
    });
  });
});

/* URL */
simply.select('#open-url').addEventListener('click', function(e) {
  e.preventDefault();
  simply.modal.open('url.html', options).then(function(content) {
    simply.select('?.modal-close', content).addEventListener('click', function(e) {
      e.preventDefault();
      simply.modal.close();
    });
  });
});

/* Inline */
simply.select('#open-inline').addEventListener('click', function(e) {
  e.preventDefault();
  simply.modal.open('<h1>Inline HTML</h1><a class="modal-close" href="#close">Close</a>', options).then(function(content) {
    simply.select('?.modal-close', content).addEventListener('click', function(e) {
      e.preventDefault();
      simply.modal.close();
    });
  });
});
