/**
 * Returns general blueprints of this subtype (data[type][subtype])
 * @method get_blueprints
 * @param  {$} element element to parse
 * @return {Object} blueprints
 */
generate.get_blueprints = function(element) {
  //to jq
  var $element = $(element);
  var type = $element.attr('type');
  var subtype = $element.attr('subtype');

  return generate.data[type][subtype];
}
