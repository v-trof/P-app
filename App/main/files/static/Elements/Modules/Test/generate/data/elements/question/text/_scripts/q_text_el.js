generate.register.element('question', 'text', {
  show_in_items: true,

  builder: function(value) {
    var $new_element = this.make_template(value);
    $new_element.html('<div class="__value">' + value.text + '</div>');

    return $new_element;
  },
  sample: {
    value: {
      text: 'Текстовый вопрос'
    }
  }
});
