editor.edit.start = function() {
  pull_put.ui.$.find(".__content").attr('state', 'edit');
  indicator.show(1);

  var element_value = editor.active_element.value;
  blueprints = editor.active_element.blueprints;
  var $edit = blueprints.edit.build(element_value);

  pull_put.ui.$.find(".__content")
    .html($edit);

  pull_put.ui.add_action(editor.edit.pull_put_actions.preview);
}
