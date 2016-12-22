results_controls.change_score_view = function(
  index, mark, score, max, $icon) {
  var reset_class = function($element) {
    $element.removeClass('m--negative');
    $element.removeClass('m--neutral');
    $element.removeClass('m--positive');
  }

  var test_score = results_display.calculate_score();

  var $mark = $('[href$="/' + results_controls.active_student +'"]')
                .parent().find('button[test="' +
                  results_controls.active_test+'"]');
  var $summary_icon = $('.summary-item').eq(index).find('button');
  var $summary_mark = $('.summary-mark')

  reset_class($mark);
  reset_class($summary_mark);

  $mark.addClass('m--' + mark.quality)
    .text(mark.value);

  results_display.update_mark(mark, test_score);

  if(score === max) {
    summary.set_icon('right', $icon);
    summary.set_icon('right', $summary_icon);
  } else if(score > 0) {
    summary.set_icon('forgiving', $icon);
    summary.set_icon('forgiving', $summary_icon);
  } else {
    summary.set_icon('wrong', $icon);
    summary.set_icon('wrong', $summary_icon);
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
