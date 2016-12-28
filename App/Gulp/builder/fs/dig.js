const fs = require('fs');
const path = require('path');
const config = require('../config');

/**
 * Goes down
 * @method dig
 * @param  {string} path what child dirs to check
 * @param  {Function} callback thing to do with all places we visit
 * @return {Array} all callback returns
 */
function dig(path, callback) {
  var dirs = walk(path);
  var results = [];

  if(config.log.walk.full) console.log('walked', dirs);

  dirs.forEach(function(dir) {
    results.push(callback(dir));
  });


  return results;
}

module.exports = dig;


function walk(dir) {
    if(config.log.walk.each) console.log('walking', dir);

    var results = [];
    var list = fs.readdirSync(dir);

    list.forEach(function(ch_dir) {
        ch_dir = dir + path.sep + ch_dir;
        let stat = fs.statSync(ch_dir);
        if (ch_dir && stat.isDirectory()) {
          results = results.concat(walk(ch_dir));
          if(ch_dir != dir) {
            results.push(ch_dir);
          }
        }
    });

    return results;
}
