const config = require('../config');

const fs_dig = require('../fs/dig');
const path = require('path');

const classify = require('../utility/classify');
const merge_sets = require('../utility/merge_sets');

const get_dependencies = require('../parsers/dependencies');
const merge_dependencies = require('../mergers/dependencies');

const get_loads = require('../parsers/loads');
const merge_loads = require('../mergers/loads');

const process_item = require('./item');
const process_utility = require('./utility');

const build_page = require('../build/page');

function process_page(dir) {
  console.log('\n\n\n BUILDING PAGE:',
              dir.replace(path.normalize(config.path.page), ''));
  //set data
  var page_info = {
    dependencies: get_dependencies.defaults(),
    loads: get_loads.defaults(),
  }

  //init
  var initial_dependencies = get_dependencies(dir);
  var tempalte = process_item(config.path.template +
                              initial_dependencies.template, 'template');
  var collected = collect_blocks(dir);

  page_info.template = initial_dependencies.template;
  page_info.title = initial_dependencies.title;

  merge_dependencies(page_info.dependencies, initial_dependencies);
  merge_dependencies(page_info.dependencies, tempalte.dependencies);
  merge_dependencies(page_info.dependencies, collected.dependencies);
  merge_loads(page_info.loads, collected.loads);

  //recursively scan & merge
  var found_elements = new Set(page_info.dependencies.elements);
  var resolved_elements = new Set([]);

  while(found_elements.size > resolved_elements.size) {
    //building task & adding to resolved
    var current = new Set([]);
    for (let element of found_elements) {
      if( ! resolved_elements.has(element)) current.add(element);
    }
    merge_sets(resolved_elements, found_elements);

    if(config.log.current) console.log('CURRENT:', current);
    //processing elements
    for (let element_path of current) {
        element_path = path.normalize(config.path.element + element_path);
        var info = classify(element_path);
        var item_info = process_item(element_path, info.parent);
        merge_loads(page_info.loads, item_info.loads);
        merge_dependencies(page_info.dependencies, item_info.dependencies);
        merge_sets(found_elements, item_info.dependencies.elements);
    }
  }


  if(config.log.resolved) {
    console.log('Resolved:', resolved_elements);
    console.log('TOTAL:', resolved_elements.size);
  }

  //sorting
  page_info = full_sort(page_info);

  if(config.log.info.page) console.log('PAGE_INFO:', page_info, dir);


  //build
  build_page(dir, page_info);
  console.log('_______________________');
}

module.exports = process_page;

//local utils
function collect_blocks(dir) {
  var block_dependencies_arr = fs_dig(dir, function(dir_path) {
    var info = classify(dir_path, dir);
    switch (info.type) {
      case "item":
        return process_item(dir_path, info.parent);
      case "block":
        return process_item(dir_path, info.parent);
      case "utility":
        return process_utility(dir_path);
    }
  });

  for(let i = 1; i < block_dependencies_arr.length; i++) {
    merge_dependencies(
      block_dependencies_arr[0].dependencies,
      block_dependencies_arr[i].dependencies);

    merge_loads(
      block_dependencies_arr[0].loads,
      block_dependencies_arr[i].loads);
  }


  console.log('Barr:', block_dependencies_arr)

  if( ! block_dependencies_arr.length) {
    return {
      dependencies: get_dependencies.defaults(),
      loads: get_loads.defaults()
    }
  }


  return block_dependencies_arr[0];
}

function full_sort(obj) {
  var new_obj = {};
  for(let key in obj) {
    if(obj[key] instanceof Set) {
      var arr = Array.from(obj[key]).sort();
      new_obj[key] = new Set(arr);
    } else if(obj[key] instanceof Object) {
      new_obj[key] = full_sort(obj[key]);
    } else {
      new_obj[key] = obj[key];
    }
  }

  return new_obj;
}
