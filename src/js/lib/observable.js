var observable = function(element) {
  var callbacks = {};

  element.on = function(events, callback) {
    events.split(' ').forEach(function(e) {
      (callbacks[e] = callbacks[e] || []).push(callback);
    });

    return element;
  };

  element.trigger = function(e) {
    var parameters = [].slice.call(arguments, 1);

    if (callbacks[e]) {
      callbacks[e].forEach(function(callback) {
        callback.apply(element, parameters);
      });
    }

    return element;
  };

  return element;
};

Simply.observable = observable;
