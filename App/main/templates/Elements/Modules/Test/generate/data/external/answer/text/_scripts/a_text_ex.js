generate.register.external('answer', 'text', {
  get_value($element) {
    return $element.find('input').val();
  },

  get_summary($element) {
    return $element.find('input').val();
  },

  to_answer(user_answer, right_answer) {
    console.log(user_answer, right_answer);
    var $user = $('<span></span>');
    var $right = $('<span></span>');

    $user.html(user_answer);
    $right.html(right_answer);
    return {
      user: $user,
      right: $right
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
