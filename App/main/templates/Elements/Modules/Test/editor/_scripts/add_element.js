editor.insert_new_task = function($gap) {
  var position = $('.preview>.content .__gap').index($gap[0]);
  if(pull_put.ui.$.find(".__content").attr('state') === 'edit') {
    editor.edit.change_value();
  }

  if(defined(editor.active_element.value)) {
    var $element = editor.active_element.build();

    var $new_task = editor.create_new_task();

    $gap.before($new_task);
    $new_task.find('.__content').append($element);

    editor.test_data.insert_task(position, editor.active_element.value);

    editor.check.numbers();
    editor.check.empty();
  }
}

editor.create_new_task = function() {
  var $new_task = generate.data.task.default.build();
  var $gap = $($new_task[0])


  pull_put.put_zone.add($gap, function() {
    editor.insert_new_task($gap);
    pull_put.reset();
  });

  indicator.add($gap, 'add', 1);

  $new_task.find('.__make_template').click(function() {
    generate.data.task.default.element.make_template();
  });

  var $actions = $new_task.find('.__overall>.__actions');

  button_delete.add($actions, $new_task, function() {
    var task_pos = $('.preview .__task').index($new_task[1]);

    // console.log($new_task[1]);
    // console.log(task_pos);

    editor.test_data.delete_task(task_pos);

    setTimeout(editor.check.numbers, 150);
  });

  $new_task.find('.m--button-delete').removeClass('m--button-delete');

  return $new_task;
}

pull_put.actions.add = function() {
  if(pull_put.ui.$.find(".__content").attr('state') === 'edit') {
    editor.edit.change_value();
  }

  if(defined(editor.active_element.value)) {
    var $element = editor.active_element.build();

    var $new_task = editor.create_new_task();

    $('.preview>.__content').append($new_task);
    $new_task.find('.__content').append($element);

    editor.test_data.add(editor.active_element.value,
      editor.active_element.type, editor.active_element.subtype);

    editor.check.numbers();
    editor.check.empty();
  }
}
