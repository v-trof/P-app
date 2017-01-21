generate.register.element('answer', 'textarea', {
  show_in_items: true,
  never_check: true,

  builder: function(value) {
    var $new_element = this.make_template(value);
    $new_element.append(render.inputs.textarea(
      value.label,
      '',
      value.answer,
      true
    ));

    return $new_element;
  },

  sample: {
    value: {
      label: 'Развернутый ответ',
      worth: 1
    }
  }
})
