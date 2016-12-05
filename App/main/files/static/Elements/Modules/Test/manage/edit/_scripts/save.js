test_manager.upload_queue = []
test_manager.packed_test = {}

test_manager.upload_test = function() {
  var serialized_test = JSON.parse(JSON.stringify(test_manager.packed_test));

  //serializing
  serialized_test.tasks.forEach(function(task) {
    if( ! task.is_template) return;
    delete task.is_template;
    task.content = [];
    task.parts.forEach(function(part) {
      task.content.push(generate.data.task.template
                          .unwrap_replace(part, task.variables));
    });

    delete task.variables;
    delete task.parts;
  });
  delete serialized_test.templates;

  var formData = new FormData();
  formData.append("json_file", JSON.stringify(test_manager.packed_test));
  formData.append("course_id", django.course.id);
  if(defined(django.test.id)) {
    formData.append("test_id", django.test.id);
  } else {
    formData.append("material_id", django.material.id);
  }
  formData.append('csrfmiddlewaretoken', django.csrf_token);

  formData.append('compiled_test', JSON.stringify(serialized_test));

  $.ajax({
    type:"POST",
    url:"/" + django.current_type + "/save/",
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      notification.show(response["type"], response["message"]);
      if(defined(django.test.id)) {
        window.history.pushState('Редактирование ' + test_manager.packed_test.title, 'Редактирование ' + test_manager.packed_test.heading, '/test/edit/?course_id=' + django.course.id + '&test_id=' + django.test.id);
      } else {
        window.history.pushState('Редактирование ' + test_manager.packed_test.title, 'Редактирование ' + test_manager.packed_test.heading, '/material/edit/?course_id='+ django.course.id +'&material_id='+ django.material.id +'');
      }
    }
  });
}

test_manager.drop = function(state) {
  popup.show(loads.get("Elements/Modules/Test/manage/__popup_texts/__no_"
    + state + "/"),
  function() {
    $(".__ok").click(function(event) {
      popup.hide();
    });
  });
  return;
}

test_manager.save = function() {
  if(test_manager.is_published) {
    var test = test_manager.fix_test_strict(editor.test_data);
    if( ! test) {
      return false;
    }
  } else {
    var test = test_manager.fix_test_soft(editor.test_data);
    if( ! test) return false;
  }

  test_manager.pack(test);

  if(test_manager.upload_queue.length !== 0) {
    popup.show(loads.get("Elements/Modules/Test/manage/__popup_texts/__save/"));
    console.log(loads.get("Elements/Modules/Test/manage/__popup_texts/__save/"));
  }

  var check_queue = function() {
    if(test_manager.upload_queue.length === 0) {
      test_manager.upload_test();
      popup.hide();
    } else {
      setTimeout(check_queue, 100);
    }
  }
  setTimeout(check_queue, 100);
}
