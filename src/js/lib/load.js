var load = function(element, target) {
  var isFrame = element.nodeName === 'IFRAME';

  return new Promise(function(resolve, reject) {
    /* Populate the element with content */
    if (target.match(/^([a-z]+:)?\/\//i) || target.match(/^[\w\-. \/]+$/)) {
      /* From a URL or file */
      if (isFrame) {
        element.addEventListener('load', function() {
          resolve(element);
        });
        element.src = target;
      } else {
        ajax.get(target).then(function(response) {
          element.innerHTML = response.responseText;
          resolve(element);
        }, function(error) {
          reject(error);
        });
      }
    } else {
      /* From a DOM element or a literal string */
      var html = target.match(/^#/) ? select(target).innerHTML : target;

      if (isFrame) {
        element.contentWindow.document.write(html);
      } else {
        element.innerHTML = html;
      }

      resolve(element);
    }
  });
};

Simply.load = load;
