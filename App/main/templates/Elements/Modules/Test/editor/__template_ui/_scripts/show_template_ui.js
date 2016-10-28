editor.template_ui.show = function() {
  editor.template_ui.$.removeClass('m--hidden');
  editor.template_ui.$.find('.__templates').html('');

  editor.template_ui.$.removeClass('m--hidden');

  editor.test_data.templates.forEach(function(template) {
    var actions = [{
      action: function() {
        editor.active_template = template;

        var $edit = generate.data.task.template.edit
                      .build_editor(template.parts, template.variables)

        $edit.find('.task').html(generate.data.task.template.element
                                 .build_edit(template.parts, template.group));

        generate.data.task.template.edit.observe_new_vars($edit);

        popup.show($edit);
      },
      icon: loads['Elements/Icons/edit.svg']
    }, {
      action: function() {},
      icon: loads['Elements/Icons/copy.svg']
    }, {
      action: function() {},
      icon: loads['Elements/Icons/share.svg']
    }]

    var $task = generate.data.task.template
              .build(template.parts, template.variables, template.group);

    //reset actions
    var $actions = $task.find('.__actions');
    $actions.find('button').remove();

    actions.forEach(function(button) {
      var $action = $('<button class="m--ghost m--icon"></button>');
      $action.append(button.icon);
      $action.click(button.action);
      $actions.append($action);
    });

    button_delete.add($actions, $task, function() {
      //delete
    });

    $actions.find('.m--button-delete').removeClass('m--button-delete');

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
