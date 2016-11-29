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
