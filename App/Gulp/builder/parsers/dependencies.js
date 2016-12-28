const replace = require('../utility/replace');
const classify = require('../utility/classify');
const config = require('../config');
const fs = require('fs');
const path = require('path');

const defaults = {
  elements: new Set([]),
  styles: {
    module: new Set([]),
    element: new Set([]),
    page: new Set([]),
    template: new Set([])
  },
  scripts: {
    element: new Set([]),
    module: new Set([]),
    page: new Set([]),
    template: new Set([])
  }
}

module.exports = function(dir) {
  if(dir[dir.length - 1] !== path.sep) {
    dir += path.sep;
  }
  //reading
  try {
    var file = fs.readFileSync(dir + config.name.dependencies);
  } catch (err) {
    if(config.log.dependencies.read_error) {
      console.error('No dependencies at', '\n\n', dir);}
    return defaults;
  }

  //parsing
  try {
    var dependencies = JSON.parse(file);
    make_replacements(dependencies);
    dependencies.elements = new Set(dependencies.elements);
  } catch (err) {
    if(config.log.dependencies.read_error) {
      console.error('Dependencies error at', '\n\n', dir);
      console.error(err);}
    return defaults;
  }

  //separating
  dependencies.scripts = separate_assets(dependencies.scripts);
  dependencies.styles = separate_assets(dependencies.styles);

  if(config.log.dependencies.list) {
    console.log("Dependencies AT:", dir, ":", dependencies);}

  return dependencies;
}

module.exports.defaults = function() {
  return clone(defaults);
};

function separate_assets(asset) {
  var separated = {
    page: new Set([]),
    element: new Set([]),
    module: new Set([]),
    template: new Set([])
  }


  if(asset instanceof Array) {
    asset.forEach(function(item) {
      let parent = classify(item).parent;
      separated[parent].add(item);
    });
  }

  return separated;
}



function make_replacements(dependencies, dir) {
  for(key in dependencies) {
    if(dependencies[key] instanceof Array) {
      for(i in dependencies[key]) {
        dependencies[key][i] = replace.relative(dependencies[key][i], dir);
      }
    }
  }
}

function clone(obj) {
  if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
    return obj;

  if (obj instanceof Set)
    var temp = new obj.constructor(); //or new Set(obj);
  else
    var temp = obj.constructor();

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj['isActiveClone'] = null;
      temp[key] = clone(obj[key]);
      delete obj['isActiveClone'];
    }
  }

  return temp;
}
