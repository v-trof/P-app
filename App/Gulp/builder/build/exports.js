const fs = require('fs');
const path = require('path');
const config = require('../config');
const replace = require('../Utility/replace');

function build_exports(dir) {
  dir = path.normalize(dir);
  if(dir[dir.length - 1] !== path.sep) {
    dir += path.sep;
  }

  if(config.log.exports.start) console.log('exporting:', dir);

  var end = dir.split(path.sep).slice(-2)[0];
  //reading
  try {
    var proto_file = fs.readFileSync(dir + end + '.html', 'utf8', 'r');
  } catch (err) {
    if(config.log.exports.read_error) {
      console.error('No exports at', dir, '\n\n', err);}
  }

  //parsing
  try {
    proto_file = replace.relative(proto_file, dir);
    proto_file = replace.exports(proto_file);
    proto_file = replace.whitespace(proto_file);
    fs.writeFile(dir + config.name.exports, proto_file, function() {});
  } catch (err) {
    if(config.log.exports.read_error) {
      console.error('exports error at', dir, '\n\n', err);}
  }
}

module.exports = build_exports;
