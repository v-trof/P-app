function defined(variable) {
  if (typeof variable !== typeof undefined) {
    return true;
  } else {
    return false;
  }
}

Array.prototype.has = function(value) {
  return (this.indexOf(value) > -1);
}

//remvoe function
Array.prototype.remove = function() {
  var what, a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
