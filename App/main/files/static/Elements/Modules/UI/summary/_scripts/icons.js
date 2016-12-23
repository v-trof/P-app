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
