var attempt = attempt || {};


attempt.send_queue = {}

setInterval(function() {
  for(task_index in attempt.send_queue) {
    attempt.send_queue[task_index]();
  }
}, 60000);

attempt.icons = {
  empty: {
    icon: loads["Elements/Icons/minus.svg"],
    tip: "Пусто"
  },
  spinner: {
    icon: loads["Elements/Icons/spinner.svg"],
    tip: "Сохраняем на сервере"
  },
  synced: {
    icon: loads["Elements/Icons/save.svg"],
    tip: "Сохранено"
  },
  error: {
    icon: loads["Elements/Icons/sync_problem.svg"],
    tip: "Не удалось сохранить, запишите его. Мы будем пытаться отправить его вновь",
    class: "m--negative"
  }
}

attempt.make_summary_item = function(show_index, value, real_index, $sync_element) {
  var $summary_item = $(loads.get("Elements/Modules/UI/summary/__summary_item/"));
  var data = generate.data[$sync_element.attr('type')]
                [$sync_element.attr('subtype')].external;
  var $value = $summary_item.find('.__value');
  var $icon = $summary_item.find('.__icon');
  var attempt_data = django.attempt[real_index];

  function set_icon(icon) {
    console.log('ico->', icon);
    $icon.html(attempt.icons[icon].icon);
    $icon.attr('tip', attempt.icons[icon].tip);

    for(icon_name in attempt.icons) {
      if(attempt.icons[icon_name].class) {
        $icon.removeClass(attempt.icons[icon_name].class);
      }
    }

    if(attempt.icons[icon].class) {
      $icon.addClass(attempt.icons[icon].class);
    }
  }

  function _check(value, summary) {
    if( ! summary) {
      summary = "Пусто";
      set_icon('empty');
    }

    set_icon('spinner');
    $value.html(summary);

    function send_this() {
      attempt.send_value(
        real_index, value,
        function() {
          set_icon('synced');
        },
        function() {
          set_icon('error');
          attempt.send_queue[real_index] = send_this;
        });
    }

    send_this();
  }

  $summary_item.find('.__number').html(show_index + " ");

  if(value) {
    $value.html(data.get_summary(value, attempt_data));
    set_icon('synced');
  } else {
    $value.text("Пусто");
    set_icon('empty');
  }

  data.observe($sync_element, attempt_data, _check);

  return $summary_item;
}
