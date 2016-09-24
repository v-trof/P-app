generate.get_buleprints = function(element) {
  //to jq
  var $element = $(element);
  var type = $element.attr('type');
  var subtype = $element.attr('subtype');

  return generate.data[type][subtype];
}
