const replace = require('../Utility/replace');
const config = require('../config');
const fs = require('fs');
const path = require('path');

const defaults =  {
  variable: new Set([]),
  element: new Set([])
};

function parse_loads(dir) {
  if(dir[dir.length - 1] !== path.sep) {
    dir += path.sep;
  }

  //reading
  try {
    var file = fs.readFileSync(dir + config.name.loads);
  } catch (err) {
    if(config.log.loads.read_error) {
      console.error('No loads at', dir);}
    return defaults;
  }

  //parsing
  try {
    var loads = JSON.parse(file);
  } catch (err) {
    if(config.log.dependencies.read_error) {
      console.error('Loads error at', dir);
      console.error(err);}
    return defaults;
  }

  loads = make_replacements(loads);
  loads = separate_loads(loads);

  if(config.log.loads.list) {
    console.log("Loads AT:", dir, ":", loads);}
  return loads;
}

module.exports = parse_loads;
module.exports.defaults = function() {
  return clone(defaults);
}

function separate_loads(loads) {
  var new_loads = {
    variable: new Set([]),
    element: new Set([])
  }

  for(item of loads) {
    if(item.startsWith('{{')) {
      new_loads.variable.add(item);
    } else {
      new_loads.element.add(item);
    }
  }

  return new_loads;
}

function make_replacements(loads, dir) {
  for(i in loads) {
    loads[i] = replace.relative(loads[i], dir);
  }

  return loads;
}

function clone(obj) {
  if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
    return obj;

  if (obj instanceof Set)
    var temp = new obj.constructor(); //or new Date(obj);
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
