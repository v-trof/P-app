generate.register.external('answer', 'radio', {
  get_value: function($element) {
    var answers = [];
    $element.find('.m--radio').each(function(index, el) {
      if(el.querySelector('input').checked) {
        answers.push(index);
      }
    });
    return answers;
  },

  get_summary: function(value, element_data) {
    var answers = [];
    var big  = false;

    //unbinding
    value = JSON.parse(JSON.stringify(value));

    value.forEach(function(pos) {
      var option = element_data.items[pos];

      if(option.length > 20) {
        option = option.substring(0, 17).escape();
        option = option +  "&hellip;";
        big = true;
      } else {
        option = option.escape();
      }

      answers.push(option);
    })

    if(big) {
      answers = answers.join('<br>');
    } else {
      answers = answers.join(', ');
    }

    return answers;
  },


  to_answer: function(user_answer, right_answer, element_data) {
    var self = this.self;

    function make_DOM(answer) {
      element_data.answer = answer;

      var $element = self.element.build(element_data);
      $element.find('input').attr('disabled', 'disabled');

      return $element;
    }

    if( ! Array.isArray(user_answer)) {
      user_answer = [];
    }

    return {
      user: make_DOM(user_answer),
      right: make_DOM(right_answer)
    }
  },

  observer: function($element, _change) {
    $element.find('input').change(_change);
  }
});
