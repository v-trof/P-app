generate.register.external('answer', 'checkbox', {
  get_value($element) {
    var answers = [];
    $element.find('.m--checkbox').each(function(el, index) {
      if(el.querySelector('input').checked) {
        answers.push(index);
      }
    });
    return answers;
  },

  get_summary($element) {
    var answers = [];
    $element.find('.m--checkbox').each(function(el, index) {
      if(el.querySelector('input').checked) {
        answers.push(el.querySelector('label').innerHTML);
      }
    });
    return answers;
  },

  to_answer(value) {
    var answers = [];
    $element.find('.m--checkbox').each(function(el, index) {
      if(el.querySelector('input').checked) {
        answers.push(el.querySelector('label').innerHTML);
      }
    });

    return answers.join('<br>');
  },

  observer($element, _change) {
    $element.find('input').change(_change);
  }
});
