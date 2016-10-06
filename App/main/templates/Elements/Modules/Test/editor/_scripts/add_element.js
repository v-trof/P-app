pull_put.actions.add = function() {
  if(pull_put.ui.$.find(".__content").attr('state') === 'edit') {
    editor.edit.change_state();
  }

  if(defined(editor.active_element.value)) {
    var blueprints = editor.active_element.blueprints;
    var $element = blueprints.element.build(editor.active_element.value);

    var $new_task = generate.data.task.default.build();
    $('.preview>.__content').append($new_task);

    $new_task.find('.__content').append($element);

    editor.test_data.add(editor.active_element.value,
      editor.active_element.type, editor.active_element.subtype);

    $new_task.find('.__make_template').click(function() {
      blueprints.element.make_template();
    });

    var $actions = $new_task.find('.__overall>.__actions');

    button_delete.add($actions, $new_task, function() {
      setTimeout(editor.check.numbers, 150);
    });

    $new_task.find('.m--button-delete').removeClass('m--button-delete');

    editor.check.numbers();
    editor.check_empty();
  }
}
