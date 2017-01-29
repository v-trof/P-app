test_manager.upload_queue = {
  last_id: 0,
  length: 0,
  error: false,
  _pending: [],
  add: function() {
    var new_id = this.last_id++;
    this.length++;
    this._pending.push(new_id);

    return new_id;
  },
  remove: function(id) {
    this._pending.remove(id);
    this.length--;
  }
}

test_manager.packed_test = {}

test_manager.upload_test = function(success_cb) {
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
  var type = django.current_type;
  formData.append("json_file", JSON.stringify(test_manager.packed_test));
  formData.append("course_id", django.course.id);
  if(django[type] && django[type].id) {
    formData.append(type + "_id", django[type].id);
  }

  formData.append('csrfmiddlewaretoken', django.csrf_token);

  formData.append('compiled_' + type, JSON.stringify(serialized_test));

  console.log('SAVING:', formData.getAll('compiled_'+type), serialized_test, test_manager.packed_test);

  $.ajax({
    type:"POST",
    url:"/" + django.current_type + "/save/",
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      notification.show(response["type"], response["message"]);
      django[type].id = response['id'];
      if(django.current_type === 'test') {
        window.history.pushState('Редактирование ' + test_manager.packed_test.title, 'Редактирование ' + test_manager.packed_test.heading, '/test/edit/?course_id=' + django.course.id + '&test_id=' + django.test.id);

        $('.header>.__breadcrumbs>a').last().
          find('div').text(test_manager.packed_test.title);
      } else {
        window.history.pushState('Редактирование ' + test_manager.packed_test.title, 'Редактирование ' + test_manager.packed_test.heading, '/material/edit/?course_id='+ django.course.id +'&material_id='+ django.material.id +'');
      }

      setTimeout(function() {
        if(success_cb) success_cb();
      }, 300);
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

test_manager.save = function(success_cb) {
  test_manager.upload_queue.error = false;
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
      if( ! test_manager.upload_queue.error) {
        test_manager.upload_test(success_cb);
      } else {
        notification.show('error', 'Не удалось сохранить тест из-за ' +
        'ошбики с файлом. \n Его можно сохранить, ' +
        'если вы удалите поле, вызывающее ошибку.');
      }

      popup.hide();
    } else {
      setTimeout(check_queue, 100);
    }
  }
  setTimeout(check_queue, 100);
}
