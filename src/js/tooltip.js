Simply.tooltip = (function() {

  var isInitialized = false,
    optionSets = [],
    current;

  var init = function() {
    if (!isInitialized) {
      (function renderLoop() {
        window.requestAnimationFrame(renderLoop);
        render(current);
      }());

      isInitialized = true;
    }
  };

  /* Collect DOM elements that will be sticky */
  var bind = function(targets, options) {
    init();

    /* Merge the supplied options with the defaults */
    options = extend({
      class: '',
      cache: false,
      iframe: false,
      interactive: false,
      position: 'top right cursor'
    }, options || {});

    optionSets.push(options);

    var trigger,
      tooltip,
      isInteractive = options.interactive,
      customClass = options.class,
      tooltipClasses = customClass ? [customClass] : [],
      tooltipStyle;

    tooltipClasses.push('tooltip-content');

    if (!targets.length) {
      targets = [targets];
    }
    for (var i = 0, length = targets.length; i < length; i++) {
      trigger = targets[i];

      /* Create and append the 'tooltip' container */
      tooltip = createElement(options.iframe ? 'iframe' : 'div', tooltipClasses);
      tooltip.option = optionSets.length - 1;
      attach(trigger, tooltip);

      /* Calculate the number of transitions */
      tooltipStyle = computedStyle(tooltip);
      tooltip.transitions = tooltipStyle.transitionDuration === '0s' ? 0 : tooltipStyle.transitionProperty.split(',').length;

      trigger.addEventListener(isInteractive ? 'mouseenter' : 'mouseover', function(e) {
        if (e.type === 'mouseover' && e.target !== this) {
          return;
        }
        show(select('?.tooltip-content', this));
      });

      trigger.addEventListener(isInteractive ? 'mouseleave' : 'mouseout', function() {
        hide(select('?.tooltip-content', this));
        current = null;
      });

      trigger.addEventListener('mousemove', function(e) {
        current = {
          e: e,
          trigger: this
        };
      });
    }
  };

  /* Show the tooltip associated with the trigger */
  var show = function(content) {
    content.removeEventListener('transitionend', unload);

    var target = content.parentNode.getAttribute('data-tooltip');

    /* Activate CSS transitions */
    setTimeout(function() {
      addClass(content, 'is-active');
    }, 0);

    if (!content.isLoaded) {
      return new Promise(function(resolve, reject) {
        /* Populate the 'content' node */
        load(content, target).then(function() {
          content.isLoaded = true;
          resolve(content);
        }, function(error) {
          reject(error);
        });
      });
    }
  };

  /* Hide the tooltip associated with the trigger */
  var hide = function(content) {
    if (!content.transitions) {
      unload(content);
    } else {
      content.transitionCount = 0;
      content.addEventListener('transitionend', unload);
    }

    /* Activate CSS transitions */
    removeClass(content, 'is-active');
  };

  var unload = function(content) {
    content = this || content;

    var transitionsTotal = content.transitions,
      transitionCount = ++content.transitionCount;

    if ((!transitionsTotal || transitionCount === transitionsTotal) && !optionSets[content.option].cache) {
      if (content.nodeName === 'IFRAME') {
        content.src = '';
      } else {
        content.innerHTML = '';
      }

      content.isLoaded = false;
    }
  };

  var render = function(current) {
    if (!current) {
      return;
    }

    var e = current.e,
      trigger = current.trigger,
      triggerRect = rect(current.trigger),
      content = select('?.tooltip-content', trigger),
      contentStyle = content.style,
      positions = optionSets[content.option].position.split(' '),
      isFollowingCursor = positions.indexOf('cursor') > -1,
      contentWidth = content.offsetWidth,
      contentHeight = content.offsetHeight,
      triggerWidth = trigger.offsetWidth,
      triggerHeight = trigger.offsetHeight,
      halfWidth, halfHeight,
      x, y;

    /* Find the center */
    if (isFollowingCursor) {
      halfWidth = contentWidth / 2;
      halfHeight = contentHeight / 2;
      x = e.clientX - halfWidth;
      y = e.clientY - halfHeight;
    } else {
      x = triggerRect.left + (triggerWidth - contentWidth) / 2;
      y = triggerRect.top + (triggerHeight - contentHeight) / 2;
      halfWidth = (triggerWidth + contentWidth) / 2;
      halfHeight = (triggerHeight + contentHeight) / 2;
    }

    positions.forEach(function(position) {
      switch (position) {
        case 'top':
          y -= halfHeight;
          break;
        case 'bottom':
          y += halfHeight;
          break;
        case 'left':
          x -= halfWidth;
          break;
        case 'right':
          x += halfWidth;
          break;
      }
    });

    contentStyle.left = x + 'px';
    contentStyle.top = y + 'px';
  };

  return {
    bind: bind
  };
}());
