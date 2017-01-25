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
    console.log(django.material);
    formData.append("json_file", JSON.stringify(test_manager.packed_test));
    formData.append("course_id", django.course.id);
    formData.append("material_id", django.material.id);
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
        $("#test_publish").hide();
        $("#test_unpublish").show();
        popup.hide();
        test_manager.save();
      },
      error: function(response) {
        notification.show(response["type"], response["message"]);
      }
    });
  }
}
