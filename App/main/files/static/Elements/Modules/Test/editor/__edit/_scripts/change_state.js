editor.edit.change_state = function() {
  var blueprints = editor.active_element.blueprints;
  var parse_value = blueprints.edit.parse(pull_put.ui.$.find(".__content"));

  editor.active_element.value = parse_value;

  return parse_value;
}
