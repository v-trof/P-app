share.edit.parse = function($edit) {
  var share_data = share.edit.get_defaults();
  if( ! $edit) {
    console.log("NOTING TO PARSE");
    return share_data;
  }
  var tags_overall = $edit.find('*[name="overall-tags"]').val();
  var tags_subject = $edit.find('*[name="subject-tags"]').val();

  share_data.tags.main = tags_overall.replace(', ', ',').split(',');
  share_data.tags.subject = tags_subject.replace(', ', ',').split(',');
  share_data.description = $edit.find('.__text.__value').html();
  share_data.open = $edit.find('.__open')[0].checked;


  if($edit.find('.share_test input')[0] &&
     $edit.find('.share_test input')[0].checked) {
      share_data.assets.test_id = django.test.id;
      share_data.assets.test = true;
  }

  if($edit.find('.share_templates input')[0] &&
     $edit.find('.share_templates input')[0].checked) {
      share_data.assets.templates = true;
      if (django.material.id)
        share_data.assets.material_id = django.material.id;
      else  share_data.assets.test_id = django.test.id;
  }

  if($edit.find('.share_material input')[0] &&
     $edit.find('.share_material input')[0].checked) {
      share_data.assets.material_id = django.material.id;
      share_data.assets.material = true;
  }

  //here should be template parsing
  return share_data;
};
