editor.edit.stop = function() {
  editor.edit.change_state();
  pull_put.ui.$.find(".__content").attr('state', 'preview');

  var parse_value = editor.edit.change_state();

  var $element = blueprints.element.build(parse_value);

  pull_put.ui.element = $element;
  pull_put.ui.$.find(".__content").html($element);

  pull_put.ui.add_action(editor.edit.pull_put_actions.edit);
}
