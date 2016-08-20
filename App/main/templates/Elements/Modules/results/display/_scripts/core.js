var results_display = {
  init: function(test_info, attempt_info, result_info) {
    if(result_info.type === 'error') {
      panel.show("");
      $('.preview .__task').remove();

      var error_text = '<div class="card">'+ result_info.message +'</div>';

      $('.preview .__content').html(error_text);

      panel.content.html(error_text);
      return;
    }
    if(test_info) {
      test_manager.load.test(test_info);
    }
    results_display.create_summary(attempt_info, result_info);
  }
}
