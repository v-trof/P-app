$(document).ready(function() {
  generate.data.task.template.add_to_test = function(template, $edit) {
    template = JSON.parse(JSON.stringify(template));

    if(defined($edit) && editor.template_editor_mode === 'edit') {
      template = generate.data.task.template
      .element.parse_edit(
        $edit.find('.task').children(),
        template);
    }

    var finished = generate.data.task.template.build_finalized_task(template);
    var $new_task = finished.$task;

    console.log('adding to test:', finished.data);

    editor.test_data.add_template(finished.data);

    $('.preview>.__content').append($new_task);

    popup.hide();
    editor.template_ui.hide();
    editor.check.numbers();

    return $new_task;
  }
});
