Simply.modal = (function() {
  var isInitialized = false,
    layers = [],
    container;

  var init = function() {
    if (!isInitialized) {
      container = createElement('div', 'modals');

      /* Let <ESC> cancel the modal */
      document.addEventListener('keydown', function(e) {
        if (e.keyCode === 27 && layers.length) {
          cancel();
        }
      });

      /* Clicking the overlay cancels the modal */
      container.addEventListener(('ontouchend' in window) ? 'touchend' : 'click', function(e) {
        var element = e.target;
        if (element && (hasClass(element, 'modal-overlay') || hasClass(element, 'modal-cancel'))) {
          e.preventDefault();
          cancel();
        }
      });

      attach(body, container);
      isInitialized = true;
    }
  };

  /* Open a modal */
  var open = function(target, options) {
    init();

    /* Merge the supplied options with the defaults */
    options = extend({
      class: '',
      iframe: false,
      height: 'auto',
      width: 'auto'
    }, options || {});

    var layer = createLayer(options),
      content = riot.observable(contentNode(layer));

    /* Need to append the to DOM before loading content, otherwise we can't access the 'contentWindow' of an iFrame */
    attach(container, layer);
    layers.push(layer);

    /* Activate CSS transitions */
    addClass(body, 'no-scroll');
    setTimeout(function() {
      addClass(layer, 'is-active');
    }, 0);

    return new Promise(function(resolve, reject) {
      /* Populate the 'content' node */
      load(content, target).then(function() {
        resize(options.width, options.height, layer);
        resolve(content);
      }, function(error) {
        reject(error);
      });
    });
  };

  /* Close the modal */
  var close = function(isClosed) {
    var layer = topLayer();

    /* Return immediately if there are no layers (a user may click the overlay/cancel while it's still transitioning out) */
    if (!layer || layer.isTransitioning) {
      return;
    }
    layer.isTransitioning = true;

    var layerStyle = computedStyle(layer),
      transitionsTotal = (layerStyle.transitionDuration === '0s') ? 0 : layerStyle.transitionProperty.split(',').length;

    if (typeof isClosed === 'undefined') {
      isClosed = true;
    }
    if (!transitionsTotal) {
      destroyLayer(isClosed);
    } else {
      var transitionCount = 0;

      layer.addEventListener('transitionend', function() {
        transitionCount++;

        if (transitionCount === transitionsTotal) {
          destroyLayer(isClosed);
        }
      });
    }

    /* Activate CSS transitions */
    removeClass(layer, 'is-active');
  };

  /* Cancel the modal */
  var cancel = function() {
    close(false);
  };

  /* Resize a modal */
  var resize = function(width, height, layer) {
    layer = layer || topLayer();

    var content = contentNode(layer),
      frameStyle = select('?.modal-frame', layer).style,
      isFrame = content.nodeName === 'IFRAME';

    if (isFrame) {
      content = content.contentWindow.document.body;
    }

    /* If width/height is set to 'auto', find the dimensions of the contents */
    addClass(content, 'dimensions');
    var dimensions = rect(content);
    if (width === 'auto') {
      width = (isFrame ? content.scrollWidth : dimensions.width) + 'px';
    }
    if (height === 'auto') {
      height = (isFrame ? content.scrollHeight : dimensions.height) + 'px';
    }
    removeClass(content, 'dimensions');

    frameStyle.width = width;
    frameStyle.height = height;

    content.trigger('resize', content);
  };

  /* Generate a new modal layer */
  var createLayer = function(options) {
    var width = options.width,
      height = options.height,
      isFrame = options.iframe,
      customClass = options.class,
      layerClasses = (customClass ? [customClass] : []),
      layer;

    layerClasses.push('modal-overlay');
    layer = createElement('div', layerClasses);
    insertHTML('<div class="modal-frame"><div class="modal-boundry">' + ((isFrame) ? '<iframe class="modal-content"></iframe>' : '<div class="modal-content"></div>') + '</div><a class="modal-cancel" href="#cancel"></a></div>', 'afterbegin', layer);

    /* Set the initial frame dimensions (the iFrame dimensions of 300x150 are CSS2 standard dimensions for 'auto' width/height) */
    if (isFrame) {
      if (width === 'auto') {
        width = '300px';
      }
      if (height === 'auto') {
        height = '150px';
      }
    }

    var frame = select('?.modal-frame', layer),
      frameStyle = frame.style;
    frameStyle.width = width;
    frameStyle.height = height;

    return layer;
  };

  /* Remove a modal layer from the DOM */
  var destroyLayer = function(isClosed) {
    var layer = layers.pop(),
      content = contentNode(layer);

    content.trigger(isClosed ? 'close' : 'cancel', content);
    detach(container, layer);

    if (!layers.length) {
      removeClass(body, 'no-scroll');
    }
  };

  /* Get the top modal layer on the stack */
  var topLayer = function() {
    var count = layers.length;
    return (count) ? layers[count - 1] : null;
  };

  /* Get the 'content' node of a layer */
  var contentNode = function(layer) {
    return select('?.modal-content', layer);
  };

  return {
    open: open,
    close: close,
    cancel: cancel,
    resize: resize
  };
}());
