const merge_sets = require('../Utility/merge_sets');

function merge_dependencies(proto, addition) {
  function unwrap(obj, addition) {
    for (let key in obj) {
      if(obj[key] instanceof Set && addition[key] instanceof Set) {
        merge_sets(obj[key], addition[key]);
      } else if(obj[key] instanceof Object && addition[key] instanceof Object) {
        unwrap(obj[key], addition[key]);
      }
    }
  }

  unwrap(proto, addition);
}

module.exports = merge_dependencies;
