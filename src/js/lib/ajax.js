var ajax = (function() {
  var request = new XMLHttpRequest();

  var get = function(url, payload) {
    return send('GET', url, payload);
  };

  var post = function(url, payload) {
    return send('POST', url, payload);
  };

  var put = function(url, payload) {
    return send('PUT', url, payload);
  };

  var remove = function(url, payload) {
    return send('DELETE', url, payload);
  };

  var send = function(method, url, payload) {
    var queryString = '',
      formData,
      property;

    if (method.match(/GET|DELETE/)) {
      /* Serialize the payload */
      for (property in payload) {
        queryString += (queryString ? '&' : '?') + property + '=' + payload[property];
      }
      url += queryString;
    } else if (payload instanceof HTMLFormElement) {
      /* Attach the form */
      formData = new FormData(payload);
    } else {
      /* Manually create the FormData object */
      formData = new FormData();
      for (property in payload) {
        formData.append(property, payload[property]);
      }
    }

    return new Promise(function(resolve, reject) {
      request.open(method, url);

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

      request.send(formData);
    });
  };

  return {
    get: get,
    post: post,
    put: put,
    delete: remove
  };
}());

Simply.ajax = ajax;
