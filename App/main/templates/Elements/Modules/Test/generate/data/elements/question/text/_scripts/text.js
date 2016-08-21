generate.register.element('question', 'text', {
  build: function(value) {
    var $new_element = this.make_template();
    $new_element.html('<div class="__value">' + value + '</div>');

    return $new_element;
  },
  parser: function($element) {
    var value = {};
    value.html = $element.find('.__value').html();

    return value;
  },
  sample: {
    value: ['Текстовый вопрос']
  }
});
