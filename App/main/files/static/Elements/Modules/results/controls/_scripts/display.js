results_controls.display = function() {
  show_active_test(results_controls.active_test);
  var test_id = results_controls.active_test;
  var user_id = results_controls.active_student;

  var user_key = test_id + "-" + user_id;

  var test_info = results_controls.loaded.tests[user_key];

  var attempt_info = results_controls.loaded.results[user_key].attempt;
  var results_info = results_controls.loaded.results[user_key].mark;

  $('.preview>.__content').html('');
  results_display.init(test_info, attempt_info, results_info);

  var $redo = $('<button>Сбросить результаты</button>');

  $('.preview').append($redo);

  $redo.click(function() {
    $.ajax({
      url: 'test/reset_attempt/',
      data: {
        'course_id': django.course.id,
        'test_id': test_id,
        'user_id': user_id,
        'csrfmiddlewaretoken': django.csrf_token
      }
    }).success(function(response) {
       if(response && response["type"]) {
           notification.show(response["type"], response["message"]);
       } else {
         notification.show('success',
                           'Результаты сброшены, ученик может переписать');
       }
    }).error(function(error) {
      notification.show('error', "Произошла ошибка");
    });
  })
}
