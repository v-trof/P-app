generate.register.element('answer', 'text', {
  show_in_items: true,

  builder: function(value) {
    var $new_element = this.make_template(value);
    $new_element.append(loads.get('Elements/Inputs/text/'));
    $new_element.find('label').append(value.label);
    $new_element.find('input').val(value.answer);

    return $new_element;
  },

  sample: {
    value: {
      label: 'Текстовый ответ',
      worth: 1
    }
  }
})
