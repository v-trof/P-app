$(document).ready(function() {
  $('.summary').on('click', '.__note', function() {
    var id_arr = $(this).attr('id').split('-');
    var test_id = id_arr[1];
    var question_id = id_arr[0];
    results_controls.active_test = test_id;

    if(results_controls.active_student) {
      show_active_test(test_id);
      results_controls.load();
      var $task = $(
          $(".preview .answer_display ")[question_id-1]
        ).parent();

      console.log($task);
      setTimeout(function() {
        $(".preview").scrollTo($task, 300);
      }, 100);
    }
  });
});
