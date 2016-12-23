loads.get = function(path) {
  if(path[path.length - 1] == '/') {
    path += 'exports.html';
  }
  return this[path];
}
