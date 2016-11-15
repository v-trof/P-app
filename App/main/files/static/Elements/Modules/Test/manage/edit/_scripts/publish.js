test_manager.publish = function() {
  var test = test_manager.fix_test_strict(editor.test_data);

  if( ! test) return;

  popup.show(test_manager.publish_popup, function() {
    var $publish = test_manager.collect_publish();

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
    time_limit: 0
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
    parsed.time_limit = parseInt($('#max_time').val());
  }

  console.log(parsed);

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
    if(task.is_template) {
      task.parts = generate.data.task.template
                    .unwrap_replace(task.parts, task.variables);

      console.log(task);

      task.parts.forEach(function(element) {
        if(element.type === 'answer') max_points += parseInt(element.worth);
      });
    } else {
      task.content.forEach(function(element) {
        if(element.type === 'answer') max_points += parseInt(element.worth);
      });
    }
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
