generate.register.external('answer', 'classify', {
  get_value: function($element) {
    var answer = {};

    $element.children('.__class').each(function() {
      if($(this).hasClass('m--unordered')) return;

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

    //unbinding
    value = JSON.parse(JSON.stringify(value));

    for(class_name in value) {
      for(var i = 0; i < value[class_name].length; i++) {
        if(value[class_name][i].length > 20 && reduce) {
          value[class_name][i] = value[class_name][i].substring(0, 16).escape();
          value[class_name][i] = value[class_name][i] + "...";
        } else {
          value[class_name][i] = value[class_name][i].escape();
        }
        classes.remove(class_name);
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

    if(value.items.length === 0) {
      console.log('empty');
      return "";
    }

    var $summary = this.self.element.build(value);

    $summary.find('*').unbind('click');

    return $summary;
  },


  to_answer: function(user_answer, right_answer, element_data) {
    // build
    var self = this;
    var make_DOM = function(answer) {
      console.log(answer);
      answer = self.unwrap_answer(answer, true);
      var $element = self.self.element.build(answer);

      $element.find('*').unbind('click');

      return $element;
    }

    return {
      user: make_DOM(user_answer),
      right: make_DOM(right_answer)
    }
  },

  observer: function($element, _change) {
    $element.find('.__items').click(function(event) {
      if(pull_put.is_pulled) {
        _change();
      }
    });
  }
});


//TODO fix attempt icon swap
