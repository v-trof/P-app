generate.register.edit('question', 'text', {
  build: function(value) {
    var $new_edit = this.make_template();
    $new_edit.prepend(loads["Elements/Inputs/text/textarea/"]);

    inline_editor.start($new_edit.find('.__value')[0]);

    return $new_edit;
  }
});
