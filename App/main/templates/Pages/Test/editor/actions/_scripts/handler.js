$(document).ready(function() {

  {% if test.published %}
    console.log('back');
    test_manager.is_published = true;
  {% endif %}

  $("#test_save").click(function(event) {
    if(pull_put.is_pulled) {
      pull_put.puller.cancel();
    }
    setTimeout(test_manager.save, 200);
  });

  $("#test_publish").click(function(event) {
    if(pull_put.is_pulled) {
      pull_put.puller.cancel();
    }
    setTimeout(function() {
      test_manager.save(test_manager.publish);
    }, 200);
  });

  $("#test_unpublish").click(function(event) {
    test_manager.unpublish();
  });

  $("#test_delete").click(function(event) {
    test_manager.delete();
  });

  $('#test_templates').click(function() {
    editor.template_ui.show();
  });

  $("#test_share").click(function(event) {
    share.edit.show();
  });

  $("#test_import").click(function(event) {
    share.search.show();
  });
});
