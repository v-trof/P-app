test_manager = {}

test_manager.load = function(test) {
  if(typeof test === 'string') {
    test = JSON.parse(test);
  }
  console.log(test)
  var editor_defined = (typeof editor !== 'undefined');

  if (editor_defined) {
    if( ! editor.test_data.title) {
      $('.preview h2').html(test.title);
      editor.test_data.title = test.title;
    }

    test.tasks.forEach(function(task) {
      editor.test_data.tasks.push(task);
    });

    test.templates.forEach(function(template) {
      editor.test_data.templates.push(template);
    });
  }

  test.tasks.forEach(function(task, index) {
    if(task.is_template) {
      var task_bundle = generate.data.task.template.build_finalized_task(task);

      $('.preview>.__content').append(task_bundle.$task);
    } else {
      if(editor_defined) {
        var $new_task = editor.create_new_task();
      } else {
        var $new_task = generate.data.task.default.build();
        $new_task.find('.__actions').remove();
        $new_task.find('.__number').html(index + 1);
      }
      $('.preview>.__content').append($new_task);

      $new_task.find('.__group').val(task.group);
      task.content.forEach(function(element) {
        var $element = generate.data[element.type][element.subtype].element.build(element);
        $new_task.find('.__content').append($element);
      });
    }
  });

  if(editor_defined) {
    editor.check.numbers();
    editor.check.empty();
  }
}

test_manager.delete = function() {
  var formData = new FormData();
  formData.append("course_id", django.course.id);
  if(defined(django.test.id)) {
    formData.append("test_id", django.test.id);
  } else {
    formData.append("material_id", django.material.id);
  }
  formData.append('csrfmiddlewaretoken', django.csrf_token);

  $.ajax({
    type:"POST",
    url:"/" + django.current_type + "/delete/",
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

test_manager.fix_test_strict = function(test) {
  var fixable = true;

  test = test_manager.fix_test_soft(test);

  if( ! test) {
    return false;
  }

  test.groups = {};

  test.tasks.forEach(function(task) {
    var elements;

    if( ! defined(task.content)) {
      elements = task.parts;
    } else {
      elements = task.content;
    }

    if(elements.length === 0) {
      test_manager.drop('publish');
      return false;
    }

    elements.forEach(function(element) {
      console.log(element);
      if(element.type === 'answer' && ! (element.never_check
        || element.answer)) {
      if(element.answers.length == 0) {
        test_manager.drop('publish');
        fixable = false;
      }}
    });

    if(task.group) {
      if(test.groups[task.group]) {
        test.groups[task.group]++;
      } else {
        test.groups[task.group] = 1;
      }
    }
  });

  if( ! fixable) {
    return false;
  }

  if(Object.keys(test.groups).length !== 0) {
    test.groups['Другие'] = 0;
    test.tasks.forEach(function(task) {
      if( ! task.group) {
        task.group = "Другие";
        test.groups['Другие']++;
      }
    });
    if(test.groups['Другие'] === 0) delete test.groups['Другие'];
  } else {
      test.groups['Задания'] = test.tasks.length;
  }

  return test;
}

test_manager.fix_test_soft = function(test) {
  test = JSON.parse(JSON.stringify(test));

  if( ! test.title ) {
    console.log('no heading');
    test_manager.drop('save');
    return false;
  }

  if(test.tasks.length === 0) {
    console.log('no empty');
    test_manager.drop('save');
    return false;
  }


  return test;
}

function upload_file(file_to_upload, url_handler) {
  var file_id = test_manager.upload_queue.add();

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
    success: function(response) {
      test_manager.upload_queue.remove(file_id);
      console.log(response);
      url_handler(response);
    },
    error: function(response) {
      test_manager.upload_queue.remove(file_id);
      notification.show('error', 'Ошбика при загрузке '+file_to_upload.name);
      test_manager.upload_queue.error = true;
    }
  });
}

test_manager.look_for_files = function(content) {
  content.forEach(function(part) {
    if(defined(part.asset_id)) {
      if(editor.assets.get(part.asset_id).files) {
        upload_file(editor.assets.get(part.asset_id).files[0], function(url) {
          part.url = url;
          part.asset_id = undefined;
        });
      } else {
        part.asset_id = undefined;
      }
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

test_manager.publish = function() {
  var test = test_manager.fix_test_strict(editor.test_data);

  if( ! test) return;

  popup.show(test_manager.publish_popup, function() {
    var $publish = test_manager.collect_publish();

    //serializing
    test.tasks.forEach(function(task) {
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
    delete test.templates;

    //build
    for(var group_name in test.groups) {
      $publish.build.append(
        test_manager.render_inline(group_name, test.groups[group_name])
      );
    }
    $publish.build.find('.__value').attr('disabled', 'disabled');

    $('#random_build').change(function() {
      if(this.checked) {
        $publish.build.find('.__value').removeAttr('disabled');
        $('#random_order').removeAttr('disabled');
      } else {
        $publish.build.find('.__value').attr('disabled', 'disabled');
        $('#random_order').attr('disabled', 'disabled');
      }
    });

    //marks
    var max_points = test_manager.calculate_max_points(test);

    for(var i = 5; i >= 2; i--) {
      $publish.marks.append(
        test_manager.render_inline(i + ' от', max_points)
      );
    }

    //section
    $('#course_section').change(function() {
      if(this.value === 'Новая...') {
        $("#new_section_name").removeAttr('disabled');
      } else {
        $("#new_section_name").attr('disabled', 'disabled');
      }
    });

    //time
    $('#limit_time').change(function() {
      if(this.checked) {
        $publish.time.find('.__value').removeAttr('disabled');
      } else {
        $publish.time.find('.__value').attr('disabled', 'disabled');
      }
    });

    $("#max_time").change(function() {
      if(this.value < 1 || isNaN(this.value)) this.value = 1;
    });

    $publish.button.click(function() {
      test_manager.publish_parse(test);
    });
  }, {'width': '64rem'});
}

test_manager.publish_parse = function(test) {
  var $publish = test_manager.collect_publish();

  var data_is_fine = true;

  var parsed = {
    random: {
      do: false,
      shuffle: false,
      limits: {}
    },
    forgive: {},
    max_score: test_manager.calculate_max_points(test),
    marks: {
      "5": 0,
      "4": 0,
      "3": 0,
      "2": 0
    },
    section: "Нераспределенные",
    time_limit: "00:00:00"
  };

  //build
  if($('#random_build').is(':checked')) {
    parsed.random.do = true;
    if($('#random_order').is(':checked')) {parsed.random.shuffle = true};
    $publish.build.find('.row').each(function() {
      var group_name = $(this).find('.__group').text();
      //removing :
      group_name = group_name.substring(0, group_name.length - 2);

      var group_limit = parseInt($(this).find('.__value').val());

      if( ! group_limit ) {
        data_is_fine = false;
        notification.show('warning', 'Введите квоту для типа ' + group_name);
      }

      parsed.random.limits[group_name] = parseInt(group_limit);
    });
  }

  //forgive
  $publish.forgive.find("input").each(function(index, el) {
    parsed.forgive[$(this).attr("id")] = this.checked;
  });

  //marks
  $publish.marks.find("input").each(function(index, el) {
    var mark = 5 - index;
    parsed.marks[mark.toString()] = parseInt(this.value);

    if( ! this.value) {
      data_is_fine = false;
      notification.show('warning', 'Введите минимальный балл для ' + mark);
    }
  });

  //section
  if($('#course_section').val() === 'Новая...') {
    parsed.section = $('#new_section_name').val();
  } else {
    parsed.section = $('#course_section').val();
  }

  if( ! parsed.section) {
    notification.show('warning', 'Выберите секцию для размещения теста');
    data_is_fine = false;
  }

  //time
  if($('#limit_time').is(':checked')) {
    var mins_limit = parseInt($('#max_time').val());
    parsed.time_limit = [Math.floor(mins_limit/60), mins_limit%60, 0].join(':');
    parsed.time_limit = test_manager.expand_time(parsed.time_limit);
  }

  console.log('PUBLISHING', parsed);

  if(data_is_fine) {
    var formData = new FormData();
    formData.append("json_file", JSON.stringify(test_manager.packed_test));
    formData.append("course_id", django.course.id);
    if(defined(django.test.id)) {
      formData.append("test_id", django.test.id);
    } else {
      formData.append("material_id", django.material.id);
    }
    formData.append('csrfmiddlewaretoken', django.csrf_token);

    formData.append('publish_data', JSON.stringify(parsed));

    //formData.append('compiled_test', JSON.stringify(test));

    $.ajax({
      type:"POST",
      url:"/"+django.current_type+"/publish/",
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        notification.show(response["type"], response["message"]);
        $("#" + django.current_type + "_publish").hide();
        $("#" + django.current_type + "_unpublish").show();
        popup.hide();
        test_manager.save();
      },
      error: function(response) {
        notification.show(response["type"], response["message"]);
      }
    });
  }
}

test_manager.calculate_max_points = function(test) {
  var max_points = 0;
  test.tasks.forEach(function(task) {
    task.content.forEach(function(element) {
      if(element.type === 'answer') max_points += parseInt(element.worth);
    });
  });

  return max_points;
}

test_manager.collect_publish = function() {
  var collected = {}

  collected.build = popup.$.find('.__build-settings');
  collected.forgive = popup.$.find('.__forgive');
  collected.marks = popup.$.find('.__mark-settings');
  collected.section = popup.$.find('.__course-section');
  collected.time = popup.$.find('.__time-settings');
  collected.button = popup.$.find('#publish');

  return collected;
}

test_manager.render_inline = function(label, max) {

  console.log('rendering:', label, max);
  var $new_item = $(
    "<div class='row'>" +
      "<div class='__group'>" + label + ": </div>" +
      loads.get('Elements/Inputs/text/inline/') +
      "<div class='__max'> / " + max + "</div>" +
    "</div>");

  $new_item.find('input').change(function() {
    var val = this.value;
    val = parseInt(val);

    console.log(val, max);

    if(val < 0 || isNaN(val)) val = 0;
    if(val > max) val = max;

    this.value = val;
  });

  return $new_item;
}

/**
 * turns h:m:s to hh:mm:ss
 * @method expand_time
 * @param  {string} hms time to turn into hh:mm:ss
 * @return {string} hh:mm:ss
 */
test_manager.expand_time = function(hms) {
  var hhmmss = hms.split(':');
  for(var i = 0; i < hhmmss.length; i++) {
    if(hhmmss[i].length == 1) hhmmss[i] = '0' + hhmmss[i];
  }

  return hhmmss.join(':');
}

test_manager.publish_material = function() {
  var test = test_manager.fix_test_strict(editor.test_data);

  if( ! test) return;

  popup.show(test_manager.publish_popup, function() {
    var $publish = test_manager.collect_publish();

    //serializing
    test.tasks.forEach(function(task) {
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
    delete test.templates;

    //section
    $('#course_section').change(function() {
      if(this.value === 'Новая...') {
        $("#new_section_name").removeAttr('disabled');
      } else {
        $("#new_section_name").attr('disabled', 'disabled');
      }
    });

    $publish.button.click(function() {
      test_manager.publish_parse_material(test);
    });
  }, {'width': '64rem'});
}

test_manager.publish_parse_material = function(test) {
  var $publish = test_manager.collect_publish();

  var data_is_fine = true;

  var parsed = {
    section: "Нераспределенные",
  };

  //section
  if($('#course_section').val() === 'Новая...') {
    parsed.section = $('#new_section_name').val();
  } else {
    parsed.section = $('#course_section').val();
  }

  if( ! parsed.section) {
    notification.show('warning', 'Выберите секцию для размещения теста');
    data_is_fine = false;
  }

  if(data_is_fine) {
    var formData = new FormData();
    formData.append("json_file", JSON.stringify(test_manager.packed_test));
    formData.append("course_id", django.course.id);
    if(defined(django.test.id)) {
      formData.append("test_id", django.test.id);
    } else {
      formData.append("material_id", django.material.id);
    }
    formData.append('csrfmiddlewaretoken', django.csrf_token);

    formData.append('publish_data', JSON.stringify(parsed));

    //formData.append('compiled_test', JSON.stringify(test));

    $.ajax({
      type:"POST",
      url:"/"+django.current_type+"/publish/",
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        notification.show(response["type"], response["message"]);
        $("#" + django.current_type + "_publish").hide();
        $("#" + django.current_type + "_unpublish").show();
        popup.hide();
        test_manager.save();
      },
      error: function(response) {
        notification.show(response["type"], response["message"]);
      }
    });
  }
}

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
  formData.append(type + "_id", django[type].id);
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
      if(django.current_type === 'test') {
        window.history.pushState('Редактирование ' + test_manager.packed_test.title, 'Редактирование ' + test_manager.packed_test.heading, '/test/edit/?course_id=' + django.course.id + '&test_id=' + django.test.id);

        $('.header>.__breadcrumbs>a').last().
          find('div').text(test_manager.packed_test.title);
      } else {
        window.history.pushState('Редактирование ' + test_manager.packed_test.title, 'Редактирование ' + test_manager.packed_test.heading, '/material/edit/?course_id='+ django.course.id +'&material_id='+ django.material.id +'');
      }

      if(success_cb) success_cb();
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

test_manager.unpublish = function() {
  var formData = new FormData();
  formData.append("course_id", django.course.id);
  if(defined(django.test.id)) {
    formData.append("test_id", django.test.id);
  } else {
    formData.append("material_id", django.material.id);
  }
  formData.append('csrfmiddlewaretoken', django.csrf_token);
  $.ajax({
    type:"POST",
    url:"/"+django.current_type+"/unpublish/",
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      notification.show(response["type"], response["message"]);
      $("#" + django.current_type + "_publish").show();
      $("#" + django.current_type + "_unpublish").hide();
      test_manager.is_published = false;
    }
  });
}
