$.fn.replaceTag = function(f) {
  var results = [],
    queue_size = this.length;
  while (queue_size--) {
    var new_element = document.createElement(f),
      source = this[queue_size],
      attributes = source.attributes;
    for (var c = attributes.length - 1; c >= 0; c--) {
      var current_attr = attributes[c];
      new_element.setAttribute(current_attr.name, current_attr.value)
    }
    new_element.innerHTML = source.innerHTML;
    $(source).after(new_element).remove();
    results[queue_size - 1] = new_element
  }
  return $(results)
}
