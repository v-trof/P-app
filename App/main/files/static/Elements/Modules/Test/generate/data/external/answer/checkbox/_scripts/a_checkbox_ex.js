generate.register.external('answer', 'checkbox', {
  get_value($element) {
    var answers = [];
    $element.find('.m--checkbox').each(function(index, el) {
      if(el.querySelector('input').checked) {
        answers.push(index);
      }
    });
    return answers;
  },

  get_summary(value, element_data) {
    var answers = [];
    var big  = false;

    value.forEach(function(pos) {
      var option = element_data.options[pos];

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


  to_answer(user_answer, right_answer, element_data) {
    function make_DOM(answers) {
      var $list = $("<ul></ul>");
      $list.append('<li>' + answers.join('</li><li>'));

      return $list;
    }

    var user_answers = [];
    var right_answers = [];

    if( ! Array.isArray(user_answer)) {
      user_answer = [];
    }

    element_data.options.forEach(function(option, index) {
      if(user_answer.has(index)) {
        user_answers.push(option);
      }

      if(right_answer.has(index)) {
        right_answers.push(option);
      }
    });



    return {
      user: make_DOM(user_answers),
      right: make_DOM(right_answers)
    }
  },

  observer($element, _change) {
    $element.find('input').change(_change);
  }
});
