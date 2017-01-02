const config = require('../config');

function relative(item, path) {
  if( ! path) {
    path = '';
  }
  path = path.replace("..\\..\\main\\templates\\", '');
  path = path.replace("../../main/templates/", '');
  path = path.split('\\').join('/');
  return item.split('#&/').join(path);
}

function exports(item) {
  return item.split('/"').join('/' + config.name.exports + '"');
}

function whitespace(item) {
  item = item.replace(/(?:>)\s+(?:<)/g, '><');
  item = item.replace(/\s{2,}/g, ' ');
  item = item.replace(/\r?\n|\r/g, '');
  return item;
}

module.exports = {
  relative: relative,
  exports: exports,
  whitespace: whitespace
};
