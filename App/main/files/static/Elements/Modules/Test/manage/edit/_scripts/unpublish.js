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
