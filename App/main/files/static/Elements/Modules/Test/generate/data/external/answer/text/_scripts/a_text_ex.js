generate.register.external('answer', 'text', {
  value($element) {
    return $element.find('input').val();
  },

  summary($element) {
    return $element.find('input').val();
  },

  to_answer(value) {
    return $element.find('input').val();
  }

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
