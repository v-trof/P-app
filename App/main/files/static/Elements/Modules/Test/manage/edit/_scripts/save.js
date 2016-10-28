{% if not attempt and not read %}
test_manager.upload_queue = []
test_manager.packed_test = []

test_manager.upload_test = function(test_packed) {
  console.log('upload');
  console.log(test_manager.packed_test);

  var formData = new FormData();
  formData.append("json_file", JSON.stringify(test_manager.packed_test));
  formData.append("course_id", django.course.id);
  {% if type == 'test' %}
    formData.append("test_id", django.test.id);
  {% else %}
    formData.append("material_id", django.material.id);
  {% endif %}
  formData.append('csrfmiddlewaretoken', django.csrf_token);

  $.ajax({
    type:"POST",
    url:"/{{type}}/save/",
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      notification.show(response["type"], response["message"]);
      {% if type == 'test' %}
        window.history.pushState('Test ' + django.test.id, 'Test '+ django.test.id, '/test/edit/?course_id=' + django.course.id + '&test_id=' + django.test.id);
      {% else %}
        window.history.pushState('Material '+ django.material.id, 'Material '+ django.material.id, '/material/edit/?course_id='+ django.course.id +'&material_id='+ django.material.id +'');
      {% endif %}
    }
  });
}


test_manager.save = function() {
  if(test_manager.is_published) {
    if(! test_manager.verify_test()) {
      popup.show(loads.get("Elements/Modules/test_manager/__popup_texts/no_publish/"),
      function() {
        $(".__ok").click(function(event) {
          popup.hide();
        });
      });
      console.log('dropout');
      return;
    }
  }
  test_manager.pack();

  if(test_manager.upload_queue.length !== 0) {
    popup.show(loads.get("Elements/Modules/test_manager/__popup_texts/__save/"));
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
{% endif %}
