generate.register.external('answer', 'text', {
  get_value($element) {
    return $element.find('input').val();
  },

  get_summary(value) {
    if( ! value) value = "";
    
    if(value.length > 20) {
      value = value.substring(0, 17).escape();
      value += "&hellip;"
    } else {
      value = value.escape();
    }

    return value;
  },

  to_answer(user_answer, right_answer, element_data) {
    var self = this.self;

    function make_DOM(answer) {
      element_data.answer = answer;
      var $element = self.element.build(element_data);
      $element.find('input').attr('disabled', 'disabled');

      return $element;
    }

    return {
      user: make_DOM(user_answer),
      right: make_DOM(right_answer)
    }
  },

  observer($element, _change) {
    var timer;
    var typing_interval = 1000;

    $element.keydown(function() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        var value = $element.find('.__value').val();
        _change();
      }, typing_interval);
    });
  }
});
