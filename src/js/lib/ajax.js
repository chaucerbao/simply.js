var ajax = (function() {
  var request = new XMLHttpRequest();

  var get = function(url) {
    return new Promise(function(resolve, reject) {
      request.open('GET', url);

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          resolve(request);
        } else {
          reject(Error(request.statusText));
        }
      };

      request.onerror = function() {
        reject(Error('Network error'));
      };

      request.send();
    });
  };

  return {
    get: get
  };
}());

Simply.ajax = ajax;
