$(document).ready(function() {
  generate.data.task.template
    .build_finalized_task = function(template_data) {
    //unbinding template from editor.active_template
    var unbound_data = template_data;

    //unbinding variables from initial template
    var own_variables= JSON.parse(JSON.stringify(unbound_data.variables));

    unbound_data.variables = own_variables;

    var $new_task = generate.data.task.template.build(
      unbound_data.parts,
      unbound_data.variables,
      unbound_data.group);

      //unbound_data will reference template in original list, not in editor
      $($new_task[1]).click(function(event) {
        if(
          event.target.nodeName.toLowerCase() != "button" &&
          event.target.nodeName.toLowerCase() != "path" &&
          event.target.nodeName.toLowerCase() != "svg"
        ) {
          generate.data.task.template.edit.launch(unbound_data, $new_task);
        }
      });

      button_delete.add($new_task.find('.__overall>.__actions'), $new_task,
      function() {
        var task_pos = $('.preview .__task').index($new_task[1]);
        editor.test_data.delete_task(task_pos);

        setTimeout(editor.check.numbers, 150);
      });

      $new_task.find('.m--button-delete').removeClass('m--button-delete');

      var $gap = $($new_task[0]);
      pull_put.put_zone.add($gap, function() {
        editor.insert_new_task($gap);
        pull_put.reset();
      });
      indicator.add($gap, 'add', 1);

      return {
        data: unbound_data,
        $task: $new_task
      };
    }
});
