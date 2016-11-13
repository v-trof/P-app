$(document).ready(function() {
  generate.data.task.template.to_tempalte = function($task) {
    var position = $('.preview .__task').index($task[1]);

    var old_content = editor.test_data.tasks[position].content;

    var new_task_data = {
      group: editor.test_data.tasks[position].group,
      parts: [],
      variables: [],
      is_template: true
    };

    old_content.forEach(function(part) {
      new_task_data.parts.push(part);
    });

    var new_task_bundle = generate.data.task.template.edit
                            .build_finalized_task(new_task_data);

    var new_group = editor.test_data.templates.add(new_task_bundle.data);

    new_task_bundle.data.group = new_group;

    editor.test_data.tasks[position] = new_task_bundle.data;

    new_task_bundle.$task.find('input.__group').val(new_group);
    $($task[1]).replaceWith(new_task_bundle.$task[1]);
    editor.check.numbers();
    editor.check.empty();
  }
});
