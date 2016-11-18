test_manager.load = function(test) {
  if(typeof test === 'string') {
    test = JSON.parse(test);
  }

  var editor_defined = (typeof editor !== 'undefined');

  if (editor_defined) {
    if( ! editor.test_data.title) {
      $('.preview h2').html(test.title);
      editor.test_data.title = test.title;
    }

    test.tasks.forEach(function(task) {
      editor.test_data.tasks.push(task);
    });

    test.templates.forEach(function(template) {
      editor.test_data.templates.push(template);
    });
  }

  test.tasks.forEach(function(task, index) {
    if(task.is_template) {
      var task_bundle = generate.data.task.template.build_finalized_task(task);

      $('.preview>.__content').append(task_bundle.$task);
    } else {
      if(editor_defined) {
        var $new_task = editor.create_new_task();
      } else {
        var $new_task = generate.data.task.default.build();
        $new_task.find('.__actions').remove();
        $new_task.find('.__number').html(index + 1);
      }
      $('.preview>.__content').append($new_task);

      $new_task.find('.__group').val(task.group);
      task.content.forEach(function(element) {
        var $element = generate.data[element.type][element.subtype].element.build(element);
        $new_task.find('.__content').append($element);
      });
    }
  });

  if(editor_defined) {
    editor.check.numbers();
    editor.check.empty();
  }
}
