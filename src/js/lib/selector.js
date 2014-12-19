var select = function(selector, context) {
  var matches = {
      '#': 'getElementById',
      '.': 'getElementsByClassName',
      '=': 'getElementsByTagName',
      '?': 'querySelector',
      '*': 'querySelectorAll'
    },
    regex = /[#.=?*]/.exec(selector)[0];

  return ((context || document)[matches[regex]](selector.split(regex)[1]));
};

var parent = function(target, element) {
  var parentNode, targetName;

  do {
    parentNode = element.parentNode;
    targetName = target.replace(/^[#.=]/, '');

    if (
      /^#/.test(target) && element.id === targetName ||
      /^\./.test(target) && hasClass(element, targetName) ||
      /^=/.test(target) && element.nodeName(targetName)
    ) {
      return element;
    }

    element = parentNode;
  } while (element !== document.documentElement);

  return null;
};

Simply.select = select;
Simply.parent = parent;
