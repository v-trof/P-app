generate.register.element('answer', 'radio', {
  show_in_items: true,

  builder: function(value) {
    var group = generate.counter.radio++;
    value.answer = value.answer || [];

    var $new_element = this.make_template(value);
    value.items.forEach(function(label, index) {
      var $new_checkbox = $(loads.get('Elements/Inputs/radio/'));
      $new_checkbox.find('label').text(label);

      if(value.answer.has(index)) {
        $new_checkbox.find('input')[0].checked = true;
      }

      $new_element.append($new_checkbox);
      $new_element.find('input').attr('name', "radio_" + group);
    });

    return $new_element;
  },

  sample: {
    value: {
      items: ['Вариант 1', 'Вариант 2', 'Вариант 3'],
      answer: [1],
      worth: 1
    }
  }
});
