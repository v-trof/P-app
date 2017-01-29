var summary = {}

summary.icons = {
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

  'was_changed': {
    icon: loads["Elements/Icons/edit.svg"],
    tip: "Верный ответ был изменен",
    class: "m--neutral"
  }
}

summary.set_icon = function(icon_name, $icon) {
  var icons = summary.icons;
  console.log('set_icon:', icon_name);

  $icon.html(icons[icon_name].icon);
  $icon.attr('tip', icons[icon_name].tip);

  for(key in icons) {
    if(icons[key].class) {
      $icon.removeClass(icons[key].class);
    }
  }

  if(icons[icon_name].class) {
    $icon.addClass(icons[icon_name].class);
  }
}

summary.add_icon = function(name, html, tip, special_class) {
  summary.icons[name] = {
    icon: html,
    tip: tip,
    class: special_class
  }
}

summary.make = function (test, attempt, make_summary_item) {
  console.log('making');
  panel.show("");
  panel.actions.hide();
  var global_answer_pos = 0;
  $(".preview .__task>.__content").each(function(task_index, el) {
    var item_it = -1; //for no repeat later
    var answer_pos = 0;
    var use_full_format = false;

    var $answer_fields = $(this).find('[type="answer"]');

    if($answer_fields.length > 1) {
      use_full_format = true;
    }

    $answer_fields.each(function(index, el) {
      answer_pos+=1;
      global_answer_pos+=1;
      var value;
      var $new_summary;
      var $current_task = $(this).parent().parent();
      console.log($current_task);

      item_it+=1; //step after last found
      while (test.tasks[task_index].content[item_it].type !== "answer") {
        item_it+=1;
      }

      if(use_full_format) {
        show_index = "" + (task_index+1) + "." + (index+1);
      } else {
        show_index = task_index+1;
      }
      index++;

      var real_index = global_answer_pos - 1;

      value = attempt[real_index].user_answer;
      var $new_summary = make_summary_item(show_index, value,
                                           real_index, $(this),
                                           attempt[real_index]);
      panel.content.append($new_summary);


      scroll.wire($new_summary, $current_task);
    });
  });
}
