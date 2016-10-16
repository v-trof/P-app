generate.register.element('answer', 'checkbox', {
  show_in_items: true,

  builder: function(value) {
    var $new_element = this.make_template(value);
    value.items.forEach(function(label, index) {
      var $new_checkbox = $(loads.get('Elements/Inputs/checkbox/'));
      $new_checkbox.find('label').text(label);

      if(value.answers.has(index)) {
        $new_checkbox.find('input')[0].checked = true;
      }

      $new_element.append($new_checkbox);
    });

    return $new_element;
  },

  sample: {
    value: {
      items: ['Вариант 1', 'Вариант 2', 'Вариант 3'],
      answers: [1],
      worth: 1
    }
  }
});
