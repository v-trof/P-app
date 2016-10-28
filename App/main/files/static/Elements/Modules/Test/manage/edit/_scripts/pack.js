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

test_manager.pack = function() {
  test_manager.packed_test = {
    "title": $("h2").text(),
    tasks: []
  }

  editor.test_data.tasks.forEach(function(task) {
    task.content.forEach(function(element) {
      if(element.subtype === 'image') {
        if(element.src.indexOf('blob') === 0) {
          var assets = generate.data.shared.assets;

          var src = $(this).attr('src');
          var upload = false;

          console.log(assets);

          //find file
          for(var i=0;i<=assets.last_id;i++) {
            if(
              typeof assets[i] !== "undefined" &&
              typeof assets[i].urls !== "undefined") {
                if(assets[i].urls[0] === src) {
                  upload = true;
                  file_to_upload = assets[i].files[0];
                }
              }
            }

            if(upload) {
              console.log(task_index, index, img_index);
              upload_file(file_to_upload, task_index, index);
            }

          } else if($(this).attr('src')[0] !== '/') {
            var form_data = new FormData();
            form_data.append('file_url',$(this).attr('src'));
            form_data.append('path', 'courses/'+django.course.id+'/assets/'+django.type+'/');
            form_data.append('csrfmiddlewaretoken', django.csrf_token);
            $.ajax({
              type:"POST",
              url:"/func/upload_by_url/",
              data: form_data,
              success:function(response) {
                // console.log(response);
                test_manager.packed_test.tasks[task_index][index].url=response;
              }
            });
          }
        }
      });
    });
  });
      if($(this).attr('src').indexOf("blob") == 0) {
        //file upload
      });

      //file packer
      var file_id = $(this).attr("id");
      if(typeof generate.data.shared.assets[file_id] !== "undefined") {
        var file_to_upload = generate.data.shared.assets[file_id].files[0];
        upload_file(file_to_upload, task_index, index);
      }
  });
}
