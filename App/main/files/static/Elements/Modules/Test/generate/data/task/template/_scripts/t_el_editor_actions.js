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
      if(editor.template_editor_mode === 'edit') {
        editor.active_template = generate.data.task.template
                                  .element.parse_edit(
                                    $edit.find('.task').children(),
                                    editor.active_template);
      }
      var unbound_data = editor.active_template;

      editor.test_data.add_template(unbound_data);

      var $new_task = generate.data.task.template.build(
        unbound_data.parts,
        unbound_data.variables,
        unbound_data.group);

      //unbound_data will reference template in original list, not in editor
      $new_task.click(function() {
        generate.data.task.template.edit.launch(unbound_data, $new_task);
      });

      if($instance) {
        $($instance[1]).after($new_task);
      } else {
        $('.preview>.__content').append($new_task);
      }

      popup.hide();
      editor.template_ui.hide();
      editor.check.numbers();
    });

    $save.click(function() {
      editor.test_data.templates.save(editor.active_template);

      //TODO find in preview and rebuild
    });
  }
})
