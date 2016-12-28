const classify = require('../utility/classify');
const config = require('../config');
const get_dependencies = require('../parsers/dependencies');
const fs = require('fs');
const path = require('path');

function process_utlity(dir) {
  var parent = classify(dir).parent;

  //gets word after /_
  var type = dir.split(path.sep + '_').slice(-1)[0];
  var list = [];

  list = fs.readdirSync(dir);
  var utility_files = [];

  for(i in list) {
    if(list[i] == '' || list[i].startsWith('__')) continue;

    utility_files.push(dir + path.sep + list[i]);
  }

  //dependencies format
  var utlity_info = {
    dependencies: get_dependencies.defaults(),
    loads: {
      variable: new Set([]),
      element: new Set([])
    }
  };

  utlity_info.dependencies[type][parent] = new Set(utility_files);

  if(config.log.info.utlity) console.log('UTLITY_INFO:', utlity_info, dir);

  return utlity_info;
}

module.exports = process_utlity;
