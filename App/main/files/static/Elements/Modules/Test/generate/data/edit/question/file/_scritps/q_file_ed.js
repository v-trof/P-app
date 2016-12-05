generate.register.edit('question', 'file', {
  build: function(value) {
    var $new_edit = this.make_template();

    var $filename = render.input.text('Название файла (как его увидят ученики)',
                                      'file_name', value.name);
    var $file_input = $(loads.get("Elements/Inputs/file/"));

    var file_data = file_catcher.add($filename);

    if( ! defined(value.id)) {
      value.id = editor.assets.add(file_data);
    } else {
      file_data.value.change(function() {
        editor.assets.replace(value.id, $file_input);
      });
    }

    $new_edit.append($filename);
    $new_edit.append($file_input);
    $new_edit.attr('asset-id', value.id);

    return $new_element;
  },

  parse: function($edit) {
    var value = {};
    value.id = $edit.attr('asset-id');
    value.name = $edit.find('[name="file_name"]');
    value.size = Math.floor(editor.get(value.id)
                  .files[0].size/1024/1024*100)/100 + "МБ";

    return value;
  }
});
