generate.register.edit('answer', 'text', {
  builder: function(value) {
    var $new_edit = this.make_template();

    //for label (tip)
    var $label = render.inputs.text('Формат ответа', 'label', value.label);
    $new_edit.prepend($label);

    //for right answer
    var $answer = render.inputs.text('Верный ответ', 'answer', value.answer);
    $new_edit.prepend($answer);

    return $new_edit;
  },

  parser: function($edit) {
    var value = {
      label: '',
      answer: undefined
    }

    value.label = $edit.find('[name="label"]').val();
    value.answer = $edit.find('[name="answer"]').val();

    return value;
  }
});
