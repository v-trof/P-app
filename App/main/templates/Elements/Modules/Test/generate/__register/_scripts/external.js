generate.register.external = function(type, subtype, external_data) {
  if (!(type && subtype)) return false;

  var data = this.bind_data(type, subtype, 'external', external_data);

  //creating observe shortcut for summary and send
  data.external.observe = function($element, _check) {

    if( ! defined(_check)) return false;
    data.external.observer($element, function() {
      var value = data.external.get_value($element);
      var summary = data.external.get_summary($element);
      _check(value, summary);
    });
  }

  data.external.make_answer = function(user_answer, right_answer,
                                       user_score, worth, result,
                                       element_data) {

    var answers = data.external.to_answer(user_answer, right_answer,
                                          element_data);

    if( ! user_answer) {
      answers.user = $("<b> Пропущено </b>");
    }
    var $new_answer = $(loads.get("Elements/Modules/Test/generate/" +
                                  "data/external/answer/__template/"));
    var $score = $new_answer.find('.__score');

    $new_answer.find('.__user>.__answer').html(answers.user);
    $new_answer.find('.__right>.__answer').html(answers.right);

    $score.find('.__current').html(user_score);
    $score.find('.__max').html(worth);

    generate.register.external.set_icon(result,
                                        $new_answer.find('.__data>.__icon'));

    setTimeout(function() {
      accordion.add($new_answer.find('.__right'), 'h3');
      var $accordion_toggle = $new_answer.find('.m--accordion-toggle');
      $accordion_toggle.css({
        "left": $accordion_toggle[0].offsetLeft,
        "right": "auto"
      });

      $accordion_toggle.click();
    }, 100);

    return $new_answer;
  }

  data.external.make_answer_edit = function(user_answer, right_answer,
                                       user_score, worth, result) {
    //TODO

  }

  return true;
}

generate.register.external.icons = {
  missed: {
    icon: loads["Elements/Icons/minus.svg"],
    tip: "Пропущено",
    class: "m--negative"
  },
  wrong: {
    icon: loads["Elements/Icons/close.svg"],
    tip: "Неверно",
    class: "m--negative"
  },
  forgiving: {
    icon: loads["Elements/Icons/pause.svg"],
    tip: "Неполный балл: ${got} / ${max}",
    class: "m--neutral"
  },
  right: {
    icon: loads["Elements/Icons/done.svg"],
    tip: "Верно",
    class: "m--positive"
  },

  unknown: {
    icon: loads["Elements/Icons/in_progress.svg"],
    tip: "Ждем проверки преподавателем",
    class: "m--neutral"
  },
}

generate.register.external.set_icon = function(icon, $icon) {
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
