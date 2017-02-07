generate.register.element('answer', 'text', {
  show_in_items: true,

  builder: function(value) {
    var $new_element = this.make_template(value);
    $new_element.append(render.inputs.text(
      value.label,
      '',
      value.answer
    ));

    return $new_element;
  },

  sample: {
    value: {
      label: 'Текстовый ответ',
      answer: '',
      worth: 1
    }
  }
})
