results_controls.change_score_view = function(
  index, mark, score, max, $icon) {
  var reset_class = function($element) {
    $element.removeClass('m--negative');
    $element.removeClass('m--neutral');
    $element.removeClass('m--positive');
  }

  var $mark = $('[href$="/' + results_controls.active_student +'"]')
                .parent().find('button[test="' +
                  results_controls.active_test+'"]');

  reset_class($mark);
  $mark.addClass('m--' + mark.quality)
    .text(mark.value);

  var $answer = $field.find(".__student_answer");
  var $number = $(panel.content.find('.card')[index])
              .find('.__number');
  reset_class($answer);
  reset_class($number);

  if(score === max) {
    summary.set_icon('right', $icon);
  } else if(score > 0) {
    summary.set_icon('forgiving', $icon);
  } else {
    summary.set_icon('wrong', $icon);
  }
}

results_controls.send_mark = function(index,
  mark, max, $icon) {
  summary.set_icon('spinner', $icon);
  $.ajax({
    url: '/test/change_score/',
    type: 'POST',
    data: {
      'csrfmiddlewaretoken': django.csrf_token,
      'course_id': django.course.id,
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
      $icon
    );
    // notification.show('success', 'Оценка изменена');
  })
  .error(function(error) {
    notification.show('error', error);
  })
}


$(document).ready(function() {
  summary.add_icon('spinner',
                   loads["Elements/Icons/spinner.svg"],
                   'Сохраняем на сервере',
                   'm--neutral');
});
