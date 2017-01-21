generate.register.edit('answer', 'textarea', {
  builder: function(value) {
    var $new_edit = this.make_template();

    //for label (tip)
    var $label = render.inputs.text(
      'Формат ответа / примечание', 'label', value.label);
    $new_edit.prepend($label);

    return $new_edit;
  },

  parser: function($edit) {
    var value = {
      label: '',
    }

    value.label = $edit.find('[name="label"]').val();
    return value;
  }
});
