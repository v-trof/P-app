$(document).ready(function() {
  generate.data.task.template.edit.handle_actions = function($edit, $instance) {
    var $mode_swap = $edit.find('.__mod_swap');
    var $add = $edit.find('.__add');
    var $save = $edit.find('.__save');

    var old_group = editor.active_template.group;

    //template better be unbound for prototypes
    if(! defined($instance)) {
      editor.active_template = JSON.parse(JSON.stringify(editor.active_template));
    }

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
      generate.data.task.template.add_to_test(editor.active_template, $edit);
    });

    if($instance) {
      $save.click(function() {
        if(editor.template_editor_mode === 'edit') {
          editor.active_template = generate.data.task.template
                                    .element.parse_edit(
                                      $edit.find('.task').children(),
                                      editor.active_template);
        }

        $new_task = generate.data.task.template
                      .build_finalized_task(editor.active_template).$task;

        $($instance[1]).replaceWith($new_task);
        $instance[0].remove();

        $instance = $new_task;

        var position = $('.preview .__task').index($instance[1]);

        editor.test_data.tasks[position] = editor.active_template;
        editor.test_data.tasks[position].is_template = true;

        editor.check.numbers();
        popup.hide();
      });
    } else {
      $save.click(function() {
        if(editor.template_editor_mode === 'edit') {
          editor.active_template = generate.data.task.template
                                    .element.parse_edit(
                                      $edit.find('.task').children(),
                                      editor.active_template);
        }

        editor.test_data.templates.save(editor.active_template, old_group);
        editor.template_ui.show();

        console.log('rebuilding');

        editor.test_data.tasks.forEach(function(task, index) {
          if(task.is_template) {

            var new_parts = editor.test_data.template_get_parts(task.group);
            if(new_parts) {
              task.parts = new_parts;
            }

            //[0] is gap
            var $new_task = generate.data.task.template
                              .build_finalized_task(task).$task[1];
            console.log('data:', task, 'idx:', index);
            console.log('built:', $new_task);

            $('.preview>.__content>.__task').eq(index).replaceWith($new_task);
          }
      });
        editor.check.numbers();
        popup.hide();
      });
    }
  }
});
