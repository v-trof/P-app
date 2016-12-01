generate.register.edit('question', 'text', {
  builder: function(value) {
    var $new_edit = this.make_template();
    $new_edit.prepend(loads.get("Elements/Inputs/text/textarea/"));

    $new_edit.find('label').text('Текст вопроса');
    $new_edit.find('.__value').html(value.text);

    if(value.text) {
      $new_edit.find('label').addClass('m--top');
    }

    inline_editor.start($new_edit.find('.__value')[0]);

    return $new_edit;
  },

  parser: function($edit) {
    return {
      text: $edit.find('.__value').html()
    }
  }
});
