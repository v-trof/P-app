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
