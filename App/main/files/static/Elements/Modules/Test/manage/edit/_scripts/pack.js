function upload_file(file_to_upload, task_index, index) {
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
      test_manager.packed_test.tasks[task_index][index].url=response;
      test_manager.upload_queue.remove(file_id);

      console.log("saved to:", task_index, index,
        test_manager.packed_test.tasks[task_index][index]);
      console.log(response, "as", file_id);
      console.log("removed", test_manager.upload_queue);
    }
  });
}

test_manager.pack = function(test) {
  console.log("packing:", test);
  test_manager.packed_test = test;
  //TODO source matching
}
