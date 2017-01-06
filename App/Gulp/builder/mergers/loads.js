const merge_sets = require('../Utility/merge_sets');

function merge_loads(proto, addition) {
  for (let key in proto) {
    if(proto[key] instanceof Set && addition[key] instanceof Set) {
      merge_sets(proto[key], addition[key]);
    }
  }
}

module.exports = merge_loads;
