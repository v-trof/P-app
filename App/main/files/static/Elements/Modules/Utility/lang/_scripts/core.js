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
