results_controls.send_mark = function(index, mark) {
  $.ajax({
    url: 'test/change_score/',
    data: {
      'csrfmiddlewaretoken': '{{ csrf_token }}',
      'course_id': "{{course.id}}",
      'test_id': results_controls.active_test,
      'user_id': results_controls.active_user,
      'question_id': index,
      'score': mark
    },
  })
  .success(function() {
    notification.show('success', 'Оценка изменена');
  })
  .error(function(error) {
    notification.show('error', error);
  })
  
}
