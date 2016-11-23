var attempt = attempt || {};

attempt.make_summary_item = function(show_index, value, real_index, $sync_element) {
  var $summary_item = $(loads.get("Pages/Test/attempt/main/summary_item/"));
  var data = generate.data[$sync_element.attr('type')]
                [$sync_element.attr('subtype')].external;
  var $value = $summary_item.find('.__value');
  var $icon = $summary_item.find('.__icon');
  var attempt_data = django.attempt[real_index];
  value = (django.attempt[real_index].user_answer || 'Пропущено');


  function set_icon(icon) {
    var icons = generate.register.external.icons;

    $icon.html(icons[icon].icon);
    $icon.attr('tip', icons[icon].tip);

    for(icon_name in icons) {
      if(icons[icon_name].class) {
        $icon.removeClass(icons[icon_name].class);
      }
    }

    if(icons[icon].class) {
      $icon.addClass(icons[icon].class);
    }
  }

  $summary_item.find('.__number').html(show_index + " ");

  $value.html(value);

  set_icon(attempt_data.result);
  // set_icon('negative');
  // set_icon('missed');
  // set_icon('unknown');
  // set_icon('neutral');
  // set_icon('positive');

  if(attempt_data.result == 'neutral') {
    var tip = icons.neutral.tip;
    old_tip.replace('${got}', django.attempt[real_index].user_score);
    old_tip.replace('${max}', django.attempt[real_index].worth);
    $icon.attr('tip', tip);
  }

  attempt.swap_answer(attempt_data, data, $sync_element);

  return $summary_item;
}
