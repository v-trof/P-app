editor.template_ui.show = function() {
  editor.template_ui.$.removeClass('m--hidden');
  editor.template_ui.$.find('.__templates').html('');

  editor.template_ui.$.removeClass('m--hidden');

  editor.test_data.templates.forEach(function(template) {
    var actions = [
      {
        action: function() {
          var $new_task = generate.data.task.template.add_to_test(template);
          setTimeout(function() {
            $new_task.click();
          }, 500);
        },
        icon: loads['Elements/Icons/add.svg'],
        tip: 'Добавить в тест задание из этого шаблона'
      }, {
      action: function() {
        generate.data.task.template.edit.launch(template);
      },
      icon: loads['Elements/Icons/edit.svg'],
      tip: 'Редактировать шаблон'
    }, {
      action: function() {
        editor.test_data.templates.add(template);
        editor.template_ui.show();
      },
      icon: loads['Elements/Icons/copy.svg'],
      tip: 'Копировать шаблон'
    }]

    var $task = generate.data.task.template
              .build(template.parts, template.variables, template.group);

    //reset actions
    var $actions = $task.find('.__actions');
    $actions.find('button').remove();

    actions.forEach(function(button) {
      var $action = $('<button class="m--ghost m--icon"></button>');
      $action.append(button.icon);
      $action.attr('tip', button.tip);
      $action.click(button.action);
      $actions.append($action);
    });

    button_delete.add($actions, $task, function() {
      //delete
      editor.test_data.templates_remove(template);
      editor.template_ui.show();
    });

    $actions.find('.m--button-delete')
      .removeClass('m--button-delete')
      .attr('tip', 'Удалить шаблон');

    //unbind pull_put shit
    $task.find('.__content').children().each(function() {
      $(this).unbind('click');
    });

    $task.find('.__group').attr('tip', 'Название шаблона');

    editor.template_ui.$.find('.__templates').append($task);
  });

  setTimeout(function() {
    editor.template_ui.$.removeClass('m--hiding');
  }, 10);
}
