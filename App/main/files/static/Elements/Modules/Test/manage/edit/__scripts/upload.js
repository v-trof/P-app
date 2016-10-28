test_manager.upload_test = function(test_packed) {
  console.log('upload');
  console.log(test_manager.packed_test);

  var formData = new FormData();
  formData.append("json_file", JSON.stringify(test_manager.packed_test));
  formData.append("course_id", "{{course.id}}");
  {% if type == 'test' %}
    formData.append("test_id", "{{test.id}}");
  {% else %}
    formData.append("material_id", "{{material.id}}");
  {% endif %}
  formData.append('csrfmiddlewaretoken', '{{csrf_token}}');

  $.ajax({
    type:"POST",
    url:"/{{type}}/save/",
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      notification.show(response["type"], response["message"]);
      {% if type == 'test' %}
        window.history.pushState('Test {{test.id}}', 'Test {{test.id}}', '/test/edit/?course_id={{course.id}}&test_id={{test.id}}');
      {% else %}
        window.history.pushState('Material' + loads['{{material.id}}'], 'Material {{material.id}}', '/material/edit/?course_id={{course.id}}&material_id={{material.id}}');
      {% endif %}
    }
  });
}
