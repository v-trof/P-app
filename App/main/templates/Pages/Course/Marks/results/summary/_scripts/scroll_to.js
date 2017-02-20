$(document).ready(function() {
  $('.summary').on('click', '.__note', function() {
    function check_query(student) {
      var test = results_controls.active_test;
      return $('#' + student + ' [test="' + test + '"]').hasClass('m--grey');
    }

    var id_arr = $(this).attr('id').split('-');
    var test_id = id_arr[1];
    var question_id = id_arr[0];
    results_controls.active_test = test_id;

    if(check_query(results_controls.active_student)) {
      //findiung proper active student
      $(".card.m--user").each(function() {
        if( ! check_query($(this).attr('id'))) {
          results_controls.active_student = parseInt($(this).attr('id'));
          return;
        }
      });
    }

    if(results_controls.active_student) {
      show_active_test(test_id);
      results_controls.load();
      var $question = $(
          $(".preview .answer_display ")[question_id-1]
        );

      setTimeout(function() {
        $(".preview").scrollTo($question, 300);
      }, 100);
    }
  });
});
