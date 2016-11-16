$(document).ready(function() {
  generate.data.task.template.to_tempalte = function($task, parts) {
    var position = $('.preview .__task').index($task[1]);

    var new_task_data = {
      group: editor.test_data.tasks[position].group,
      content: [],
    };

    parts.forEach(function(part) {
      new_task_data.content.push(part);
    });

    editor.test_data.tasks[position] = new_task_data;

    var $new_task = editor.create_new_task();
    new_task_data.content.forEach(function(part_data) {
      var $element = generate.data[part_data.type][part_data.subtype].
                      element.build(part_data);
      $new_task.find('.__content').append($element);
    });
    $new_task.find('.__group').val(new_task_data.group);


    $($task[1]).replaceWith($new_task);
    $task[0].remove();
    editor.check.numbers();
    editor.check.empty();
  }
});
