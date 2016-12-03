generate.register.external('answer', 'classify', {
  get_value: function($element) {
    var answer = {};

    $edit.children('.__class').each(function() {
      var title = $(this).children('h3').text();
      answer[title] = [];

      //loop over items
      $(this).find('.__item').each(function() {
        answer[title].push($(this).text());
      });
    });

    return answer;
  },

  unwrap_answer: function(value, reduce) {
    var items = [],
        classes = [];

    for(class_name in value) {
      for(var i = 0; i < value[class_name]; i++) {
        if(value[class_name][i].length > 20 && reduce) {
          value[class_name][i] = value[class_name][i].substring(0, 13).escape();
          value[class_name][i] = value[class_name][i] + "&hellip;";
        } else {
          value[class_name][i] = value[class_name][i].escape();
        }
        classes.push(class_name);
        items.push(value[class_name][i]);
      }
    }

    return {
      classes: classes,
      items: items,
      answer: value
    };
  },

  get_summary: function(value, element_data) {
    //build & item_reduce
    value = this.unwrap_answer(value, true);

    var $summary = element_data.build(value);

    $summary.find('*').removeEventListener('click');

    return $summary;
  },


  to_answer: function(user_answer, right_answer, element_data) {
    // build
    var make_DOM = function(answer) {
      var value = this.unwrap_answer(answer, false);

      var $element = this.self.element.build(value);

      $element.find('*').removeEventListener('click');

      return $element;
    }

    return {
      user: make_DOM(user_answers),
      right: make_DOM(right_answers)
    }
  },

  observer: function($element, _change) {
    $element.find('.__class').click(_change);
  }
});
