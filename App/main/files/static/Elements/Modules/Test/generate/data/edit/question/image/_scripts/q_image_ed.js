generate.register.edit('question', 'image', {
  builder: function(value) {
    var $new_edit = this.make_template();

    var $file_input = $(loads.get("Elements/Inputs/file/"));

    $new_edit.append($file_input);
    var file_data = file_catcher.add($file_input);

    if(defined(value.asset_id) || defined(value.url)) {
      $file_input.find('.__text').text(value.file_name);
      file_data.value.change(function() {
        editor.assets.replace(value.asset_id, file_data);
      });
    }

    if( ! defined(value.asset_id)) {
      value.asset_id = editor.assets.add(file_data);
    }

    return $new_edit;
  },

  parser: function($edit) {
    var value = {};
    value.asset_id = editor.active_element.value.asset_id;

    var event = editor.assets.get(value.asset_id);

    if(defined(event)) {
      value.file_name = editor.assets.get(value.asset_id).name;
      value.href = URL.createObjectURL(event.files[0]);
      value.url = undefined;
    } else {
      value.href = value.url || editor.active_element.value.href;
      value.file_name = editor.active_element.value.file_name;
    }

    return value;
  }
});
