function upload_file(file_to_upload, url_handler) {
  var file_id = test_manager.upload_queue.length;
  console.log("uplaoding file ||| id:", file_id);
  test_manager.upload_queue.push(file_id);

  var form_data = new FormData();
  form_data.append('file', file_to_upload);
  form_data.append('path', 'courses/'+django.course.id+'/assets/'+django.type+'/');
  form_data.append('csrfmiddlewaretoken', django.csrf_token);
  $.ajax({
    type:"POST",
    url:"/func/upload/",
    data: form_data,
      processData: false,
      contentType: false,
    success:function(response) {
      url_handler(response);
    }
  });
}

test_manager.look_for_files = function(content) {
  content.forEach(function(part) {
    if(defined(part.asset_id)) {
      upload_file(editor.assets.get(part.asset_id).files[0], function(url) {
        part.url = url;
        part.asset_id = undefined;
        console.log('uploaded', part);
      });
    }
  });
}

test_manager.pack = function(test) {
  test_manager.packed_test = test;

  test.templates.forEach(function(template) {
    test_manager.look_for_files(template.parts);
  });

  test.tasks.forEach(function(task) {
    if(task.is_template) {
      test_manager.look_for_files(task.parts);
    } else {
      test_manager.look_for_files(task.content);
    }
  });
}
