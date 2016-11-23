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

  get_summary($element) {
    var answers = [];
    $element.find('.m--checkbox').each(function(index, el) {
      if(el.querySelector('input').checked) {
        answers.push(el.querySelector('label').innerHTML);
      }
    });
    return answers.join(', ');
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
      user_answer = [1, 2, 3];
    }

    console.log(user_answer);

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
