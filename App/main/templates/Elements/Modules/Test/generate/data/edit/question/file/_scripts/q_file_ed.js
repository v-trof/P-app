generate.register.edit('question', 'file', {
  builder: function(value) {
    var $new_edit = this.make_template();

    var $filename = render.inputs.text('Название файла (как его увидят ученики)',
                                      'file_name', value.name);
    var $file_input = $(loads.get("Elements/Inputs/file/"));

    $new_edit.append($filename);

    $new_edit.append($file_input);
    var file_data = file_catcher.add($file_input);

    if( ! defined(value.asset_id)) {
      value.asset_id = editor.assets.add(file_data);
    } else {
      $file_input.find('.__text').text(value.file_name);
      file_data.value.change(function() {
        editor.assets.replace(value.asset_id, file_data);
      });
    }

    return $new_edit;
  },

  parser: function($edit) {
    var value = {};
    value.asset_id = editor.active_element.value.asset_id;
    value.name = $edit.find('[name="file_name"]').val();

    if(defined(editor.assets.get(value.asset_id))) {
      value.file_name = editor.assets.get(value.asset_id).name;
      value.size = Math.floor(editor.assets.get(value.asset_id)
                    .files[0].size/1024/1024*100)/100 + "МБ";
    } else {
      value.file_name = editor.active_element.value.file_name;
      value.size = editor.active_element.value.size;
    }

    return value;
  }
});
