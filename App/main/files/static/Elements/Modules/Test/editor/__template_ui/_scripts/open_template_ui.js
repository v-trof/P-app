editor.template_ui.show = function() {
  editor.template_ui.$.removeClass('m--hidden').removeClass('m--hiding')
  editor.template_ui.$.find('.__templates').html('');

  editor.template_ui.$.removeClass('m--hidden');

  editor.test_data.templates.forEach(function(template) {
    var $task = generate.data.task.template
              .build(template.parts, tempalte.variables);
    editor.template_ui.$.find('.__templates').append($task);

    $task.click(function() {
      var $edit = generate.data.task.template.element
                    .build_edit(template.parts, tempalte.group)
      popup.show($edit);
    })
  });
}
