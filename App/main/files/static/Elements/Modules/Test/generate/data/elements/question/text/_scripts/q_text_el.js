generate.register.element('question', 'text', {
  show_in_items: true,

  builder: function(value) {
    var $new_element = this.make_template(value);
    $new_element.html('<div class="__value">' + value + '</div>');

    return $new_element;
  },
  parser: function($element) {
    var value = {};
    value.html = $element.find('.__value').html();

    return value;
  },
  sample: {
    value: 'Текстовый вопрос'
  }
});
