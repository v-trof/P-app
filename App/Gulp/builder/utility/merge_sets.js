function merge_sets(proto, addition) {
  for(let item of addition) proto.add(item);
}

module.exports = merge_sets;
