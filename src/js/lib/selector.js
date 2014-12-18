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

Simply.select = select;
