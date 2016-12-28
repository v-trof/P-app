const config = require('../config');

const fs_dig = require('../fs/dig');
const path = require('path');

const classify = require('../utility/classify');
const merge_sets = require('../utility/merge_sets');

const get_dependencies = require('../parsers/dependencies');
const merge_dependencies = require('../mergers/dependencies');

const get_loads = require('../parsers/loads');
const merge_loads = require('../mergers/dependencies');

const build_exports = require('../build/exports');

const process_utility = require('./utility');

var process_item = function(dir, parent) {
  if(config.log.info.item) console.log('ITEM_INFO PROCESSING:', dir);
  //set data
  var item_info = {
    dependencies: get_dependencies.defaults(),
    loads: get_loads.defaults(),
  }

  //init
  var initial_dependencies = get_dependencies(dir);
  var initial_loads = get_loads(dir);
  var collected = collect_blocks(dir, parent);
  var proto = collect_proto(dir, parent);

  merge_dependencies(item_info.dependencies, initial_dependencies);
  merge_dependencies(item_info.dependencies, collected.dependencies);
  merge_dependencies(item_info.dependencies, proto.dependencies);

  merge_loads(item_info.loads, initial_loads);
  merge_loads(item_info.loads, collected.loads);

  build_exports(dir);

  if(config.log.info.item) console.log('ITEM_INFO:', item_info, dir);

  return item_info;
}

module.exports = process_item;

//local utils
function collect_blocks(dir, parent) {
  var block_dependencies_arr = fs_dig(dir, function(dir_path) {
    var info = classify(dir_path, dir);
    if(info.type === 'item' && info.is_block && dir_path != dir) {
      return process_item(dir_path, parent);
    }

    if(info.type === 'utility' && info.is_block) {
      if(parent != 'module') {
        return process_utility(dir_path, parent);
      } else {
        var type = dir_path.split(path.sep + '_').slice(-1)[0];
        var pseudo_info = {
          dependencies: get_dependencies.defaults(),
          loads: get_loads.defaults()
        };

        let alt_dir = path.normalize(dir);
        alt_dir = alt_dir.replace(path.normalize(config.path.main), '');
        alt_dir = alt_dir.split(path.sep).slice(0, 4).join(path.sep);

        pseudo_info.dependencies[type][parent] = new Set([alt_dir]);

        return pseudo_info;
      };
    };

    return {
      dependencies: get_dependencies.defaults(),
      loads: get_loads.defaults()
    };
  });

  for(let i = 1; i < block_dependencies_arr.length; i++) {
    merge_dependencies(
      block_dependencies_arr[0].dependencies,
      block_dependencies_arr[i].dependencies);

    merge_loads(
      block_dependencies_arr[0].loads,
      block_dependencies_arr[i].loads);
  }

  return block_dependencies_arr[0] || {
    dependencies: get_dependencies.defaults(),
    loads: get_loads.defaults()
  };
}

function collect_proto(dir, parent) {
  dir = path.normalize(dir);
  var dir_arr = dir.split(path.sep);
  var results = [];

  for(i = dir_arr.length - 1; i > 0; i--) {
    if( ! dir_arr.includes(config.name.element)) {
      break;
    }
    if(dir_arr[i][0].toLowerCase() === dir_arr[i][0]) {
      var step_path = dir_arr.slice(0, i + 1).join(path.sep);
      step_path = step_path.replace(path.normalize(config.path.element), '');
      results.push(step_path);
    } else {
      break;
    }
  }

  return {
    dependencies: {
      elements: new Set(results)
    }
  }
}
