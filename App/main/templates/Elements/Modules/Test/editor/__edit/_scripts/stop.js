editor.edit.stop = function() {
  var parse_value = editor.edit.change_value();
  pull_put.ui.$.find(".__content").attr('state', 'preview');

  var $element = blueprints.element.build(parse_value);

  pull_put.ui.element = $element;
  pull_put.ui.$.find(".__content").html($element);

  pull_put.ui.add_action(editor.edit.pull_put_actions.edit);
}
