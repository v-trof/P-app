var results_display = {}

results_display.swap_answer = function(attempt_data, field_data, $answer_field,
                                       index) {
  var $answer = $(field_data.make_answer(attempt_data.user_answer,
                                         attempt_data.answer,
                                         attempt_data.user_score,
                                         attempt_data.worth,
                                         attempt_data.result,
                                         attempt_data));
  if(attempt_data.user_answer === attempt_data.answer) {
    $answer_field.replaceWith($answer);
  } else {
    $answer_field.replaceWith($answer);
  }

  if(results_display.answer_decorator) {
    results_display.answer_decorator($answer, attempt_data, index);
  }
}

results_display.calculate_score = function() {
  var $current = $('.set_mark .__current');
  var $max = $('.set_mark .__max');

  var current = 0, max = 0;

  $current.each(function() {
    current += parseInt(this.innerHTML);
  });

  $max.each(function() {
    max += parseInt(this.innerHTML);
  });

  return {
    'score': current,
    'overall_score': max
  }
}

results_display.init = function(test_info, attempt_info, results_info) {
  test_manager.load(test_info);
  summary.make(test_info, attempt_info, results_display.make_summary_item);
  results_display.update_mark(results_info.mark, results_info);
}

results_display.make_summary_item = function(show_index, value, real_index,
                                             $sync_element, attempt_data) {
  var $summary_item = $(loads.get("Elements/Modules/UI/summary/__summary_item/"));
  var data = generate.data[$sync_element.attr('type')]
                [$sync_element.attr('subtype')].external;
  var $value = $summary_item.find('.__value');
  var $icon = $summary_item.find('.__icon');

  value = (data.get_summary(value, attempt_data) || 'Пропущено');

  $summary_item.find('.__number').html(show_index + " ");

  $value.html(value);

  summary.set_icon(attempt_data.result, $icon);

  console.log(attempt_data);

  if(attempt_data.result == 'neutral') {
    var tip = icons.neutral.tip;
    tip.replace('${got}', attempt_data.user_score);
    tip.replace('${max}', attempt_data.worth);
    $icon.attr('tip', tip);
  }

  results_display.swap_answer(attempt_data, data, $sync_element, real_index);

  return $summary_item;
}

results_display.update_mark = function(mark, test_score) {
  panel.actions.show();
  panel.actions.html('<b class="summary-mark">' + mark.value
                    + "</b>" + '(' + test_score.score + ' из '
                    + test_score.overall_score + ')');
  $('.summary-mark').addClass('m--' + mark.quality);
  $('.summary-mark').css('margin-right', '.5em');
}
