editor.edit.change_value = function() {
  if(pull_put.ui.$.find(".__content").attr('state') === 'edit') {
    var blueprints = editor.active_element.blueprints;
    var parse_value = blueprints.edit.parse(pull_put.ui.$.find(".__content"));

    editor.active_element.value = parse_value;
  } else {
    return editor.active_element.value;
  }

  return parse_value;
}
