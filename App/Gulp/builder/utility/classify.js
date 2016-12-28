const path = require('path');
const fs = require('fs');
const config = require('../config');

module.exports = function(item_path, relative = item_path) {
  item_path = path.normalize(item_path);
  relative = path.normalize(relative);

  if(config.log.item.path) {console.log('classifying:', item_path,
   'compared to', relative);}

  var info = by_path(item_path, relative);

  if (info.type && info.parent) {
    if(config.log.item.class) console.log('classified:', info);
    return info;
  }

  info.type = by_dependencies(item_path);

  if(config.log.item.class) console.log('classified:', info);
  return info;
}

//local utility
/**
 * Classifies by path, might not decide on path
 * @method by_path
 * @param  {string} item_path path to item
 * @return {Object} parent type and own type of item
 */
function by_path(item_path, relative) {
  var result = {
    type: undefined,
    parent: undefined
  }

  var item_path_arr = item_path.split(path.sep);
  var delta_path_arr = item_path.replace(relative, '').split(path.sep);

  var end = item_path_arr[item_path_arr.length - 1];

  if(item_path_arr.includes(config.name.page)) {
    result.parent = 'page';
  } else if(item_path_arr.includes(config.name.module)) {
    result.parent = 'module';
  } else if(item_path_arr.includes(config.name.element)) {
    result.parent = 'element';
  } else {
    result.parent = 'template';
  }



  var is_block = true;

  for(step of delta_path_arr.slice(1)) {
    if( ! step.startsWith('_')) {
      is_block = false;
    }
  }

  //special blocks case
  if(delta_path_arr.includes(config.name.blocks_dir) &&
     result.parent === 'module') {
       is_block = true;
  }

  if(end[0] === '_') {
    if(end === '_styles' || end === '_scripts'){
      result.type = 'utility';
    }
  }

  if(is_block && ! result.type && result.parent === 'module') {
    result.type = 'item';
  }

  result.is_block = is_block;
  return result;
}

/**
 * Classifies by dependencies.json content
 * @method by_path
 * @param  {string} item_path path to item
 * @return {string} type of item
 */
function by_dependencies(item_path) {
  if(item_path[item_path.length - 1] !== path.sep) {
    item_path += path.sep;
  }

  //reading
  try {
    var dependencies_file = fs.readFileSync(item_path +
                                            config.name.dependencies);
  } catch (err) {
    return 'item';
  }

  //parsing
  try {
    if(JSON.parse(dependencies_file).template) {
      return 'page';
    } else {
      return 'item';
    }

  } catch (err) {
    return 'item';
  }
}
