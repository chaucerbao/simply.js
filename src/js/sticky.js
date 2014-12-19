Simply.sticky = (function() {

  var isInitialized = false,
    stack = [];

  var init = function() {
    if (!isInitialized) {
      (function renderLoop() {
        window.requestAnimationFrame(renderLoop);
        render();
      }());

      isInitialized = true;
    }
  };

  /* Collect DOM elements that will be sticky */
  var bind = function(targets, options) {
    init();

    /* Merge the supplied options with the defaults */
    options = extend({
      container: ''
    }, options || {});

    var placeholder,
      placeholderStyle,
      element,
      elementStyle,
      elementMarginTop,
      elementMarginBottom;

    if (!targets.length) {
      targets = [targets];
    }
    for (var i = 0, length = targets.length; i < length; i++) {
      element = targets[i];
      elementStyle = computedStyle(element);
      element.style.width = elementStyle.width;
      elementMarginTop = elementStyle.marginTop;
      elementMarginBottom = elementStyle.marginBottom;

      /* Create a placeholder */
      placeholder = createElement('div', 'sticky-placeholder');
      placeholderStyle = placeholder.style;
      placeholderStyle.height = element.offsetHeight + 'px';
      placeholderStyle.marginTop = elementMarginTop;
      placeholderStyle.marginBottom = elementMarginBottom;

      /* Wrap the placeholder around the element */
      attachBefore(element, placeholder);
      attach(placeholder, element);

      stack.push({
        element: element,
        start: rect(element).top - parseFloat(elementMarginTop),
        end: rect(parent(options.container, element) || body).bottom,
        fullHeight: element.offsetHeight + parseFloat(elementMarginTop) + parseFloat(elementMarginBottom)
      });
    }
  };

  var render = function() {
    var sticky,
      element,
      start,
      end,
      current;

    for (var i = 0, length = stack.length; i < length; i++) {
      sticky = stack[i];
      element = sticky.element;
      start = sticky.start;
      end = sticky.end;
      current = window.pageYOffset;

      /* If the element is off-screen, don't render it */
      if (current + window.innerHeight < start || current > end) {
        continue;
      }

      if (current > start) {
        addClass(element, 'sticky-pinned');

        /* When the sticky element hits the bottom of the container, keep it inside */
        element.style.top = Math.min(end - current - sticky.fullHeight, 0) + 'px';
      } else if (start > window.pageYOffset) {
        removeClass(element, 'sticky-pinned');
      }
    }
  };

  return {
    bind: bind
  };
}());
