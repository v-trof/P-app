

results_controls.change_score_view = function(
  index, mark, score, max, $field) {
  var reset_class = function($element) {
    $element.removeClass('--negative');
    $element.removeClass('--neutral');
    $element.removeClass('--positive');
  }

  var $mark = $('.--user#' + results_controls.active_student)
                .find("button#" + results_controls.active_test);
  
  reset_class($mark);
  $mark.addClass('--' + mark.quality)
    .text(mark.value);

  var $answer = $field.find(".__student_answer");
  var $number = $(panel.content.find('.card')[index])
              .find('.__number');
  reset_class($answer);
  reset_class($number);

  if(score === max) {
    $answer.addClass('--positive')
    $number.addClass('--positive')
  } else if(score > 0) {
    $answer.addClass('--neutral')
    $number.addClass('--neutral')
  } else {
    $answer.addClass('--negative')
    $number.addClass('--negative')
  }


}

results_controls.send_mark = function(index,
  mark, max, $field) {
  $.ajax({
    url: '/test/change_score/',
    type: 'POST',
    data: {
      'csrfmiddlewaretoken': '{{ csrf_token }}',
      'course_id': "{{course.id}}",
      'test_id': results_controls.active_test,
      'user_id': results_controls.active_student,
      'answer_id': index,
      'score': mark
    },
  })
  .success(function(new_mark) {
    results_controls.change_score_view(
      index,
      new_mark,
      mark,
      max,
      $field
    );
    // notification.show('success', 'Оценка изменена');
  })
  .error(function(error) {
    notification.show('error', error);
  })
}
