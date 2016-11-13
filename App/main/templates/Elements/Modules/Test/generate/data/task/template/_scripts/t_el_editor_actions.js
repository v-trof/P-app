$(document).ready(function() {
  generate.data.task.template.edit.handle_actions = function($edit, $instance) {
    var $mode_swap = $edit.find('.__mod_swap');
    var $add = $edit.find('.__add');
    var $save = $edit.find('.__save');

    $mode_swap.click(function() {
      console.log('was:', editor.template_editor_mode);

      if(editor.template_editor_mode === 'edit') {
        editor.template_editor_mode = 'preview';

        editor.active_template = generate.data.task.template
                                  .element.parse_edit(
                                    $edit.find('.task').children(),
                                    editor.active_template);

        var $new_task = generate.data.task.template.build(
                          editor.active_template.parts,
                          editor.active_template.variables,
                          editor.active_template.group);
        $new_task.find('.__actions button').css('pointer-events', 'none');

        console.log($edit);

        $edit.find('.task').html($new_task);

        $mode_swap.html(loads['Elements/Icons/edit.svg'])
          .attr('tip', 'Редактировать');
      } else {
        editor.template_editor_mode = 'edit';

        $edit.find('.task').html(generate.data.task.template.element
                                 .build_edit(
                                   editor.active_template.parts,
                                   editor.active_template.group));

        generate.data.task.template.edit.observe_new_vars($edit);

        $mode_swap.html(loads['Elements/Icons/visibility.svg'])
          .attr('tip', 'Показать задание');
      }
    });

    if($instance) {
      $add.html(loads['Elements/Icons/copy.svg']);
      $add.attr('tip', 'Создать новое задание (старое сохранится)');
    }

    $add.click(function() {
      $save.click();

      if(editor.template_editor_mode === 'edit') {
        editor.active_template = generate.data.task.template
                                  .element.parse_edit(
                                    $edit.find('.task').children(),
                                    editor.active_template);
      }

      var finished = build_finilized_task(editor.active_template);
      var $new_task = finished.$task;

      console.log('adding to test:', finished.data);

      editor.test_data.add_template(finished.data);

      $('.preview>.__content').append($new_task);

      popup.hide();
      editor.template_ui.hide();
      editor.check.numbers();
    });

    if($instance) {
      $save.click(function() {
        if(editor.template_editor_mode === 'edit') {
          editor.active_template = generate.data.task.template
                                    .element.parse_edit(
                                      $edit.find('.task').children(),
                                      editor.active_template);
        }

        $new_task = build_finilized_task(editor.active_template).$task[1];

        $($instance[1]).replaceWith($new_task);

        $instance[1] = $new_task;

        editor.check.numbers();
      });
    } else {
      $save.click(function() {
        if(editor.template_editor_mode === 'edit') {
          editor.active_template = generate.data.task.template
                                    .element.parse_edit(
                                      $edit.find('.task').children(),
                                      editor.active_template);
        }

        console.log('saving', editor.active_template);

        editor.test_data.templates.save(editor.active_template);
        editor.template_ui.show();

        console.log('rebuilding');

        editor.test_data.tasks.forEach(function(task, index) {
          if(task.is_template) {

            var new_parts = editor.test_data.template_get_parts(task.group);
            if(new_parts) {
              task.parts = new_parts;
            }

            //[0] is gap
            var $new_task = build_finilized_task(task).$task[1];
            console.log('data:', task, 'idx:', index);
            console.log('built:', $new_task);

            $('.preview>.__content>.__task').eq(index).replaceWith($new_task);
          }
      });
        editor.check.numbers();
      });
    }

    function build_finilized_task(template_data) {
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
      $new_task.click(function() {
        console.log(event.target.nodeName);
        if(event.target.nodeName.toLowerCase() != "button" &&
           event.target.nodeName.toLowerCase() != "path" &&
           event.target.nodeName.toLowerCase() != "svg") {
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

      return {
        data: unbound_data,
        $task: $new_task
      };
    }
  }
})
