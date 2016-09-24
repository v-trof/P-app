$('#finish').click(function() {
  $.ajax({
    type:"POST",
    url:'../attempt/check/',
    data: {
      'test_id':"{{test.id}}",
      'course_id':"{{course.id}}",
      'csrfmiddlewaretoken':"{{ csrf_token }}"
    },
    success: function(response) {
      if(response && response["type"]) {
        if(response["type"] == "success") {
          window.location = '/test/attempt/results?course_id={{course.id}}&test_id={{test.id}}';
        }
        notification.show(response["type"], response["message"]);
      } else {
        notification.show('success', 'Тест проверен системой' );
        window.location = '/test/attempt/results?course_id={{course.id}}&test_id={{test.id}}';
      }
    },
    });
})
