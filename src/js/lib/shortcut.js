var body = document.body,
  addClass = function(element, classes) {
    var classList = element.classList;
    if (!Array.isArray(classes)) { classes = [classes]; }
    classList.add.apply(classList, classes);
  },
  removeClass = function(element, classes) {
    var classList = element.classList;
    if (!Array.isArray(classes)) { classes = [classes]; }
    classList.remove.apply(classList, classes);
  },
  hasClass = function(element, name) {
    return element.classList.contains(name);
  },
  createElement = function(tag, classes) {
    var element = document.createElement(tag);
    if (classes) { addClass(element, classes); }
    return element;
  },
  attach = function(target, element) {
    target.appendChild(element);
  },
  detach = function(target, element) {
    target.removeChild(element);
  },
  insertHTML = function(text, position, element) {
    element.insertAdjacentHTML(position, text);
  },
  computedStyle = function(element) {
    return window.getComputedStyle(element, null);
  };
