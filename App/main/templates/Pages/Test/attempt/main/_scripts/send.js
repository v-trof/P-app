var attempt = attempt || {}

attempt.append_send = function(index, value, _success_cb, _error_cb) {
  var $send_button = $("<button>Сдать тест</button>");

  $('.preview >.__content').append($send_button);

  $send_button.click(function() {
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
        notification.show('success', 'Тест проверен системой' );
        window.location = '/test/attempt/results?course_id={{course.id}}&test_id={{test.id}}';
    });
}

attempt.send_value = function(index, value) {
  $.ajax({
			type:"POST",
			url:"../attempt/save/",
			data: {
			"question": index,
			"answer": value,
			"test_id":"{{test.id}}",
			"course_id":"{{course.id}}",
			"csrfmiddlewaretoken":"{{ csrf_token }}"
		},
			error: function() {
				notification.show('error', 'Не удалось сохранить ответ на сервере, <br> не закрывайте тест' );
			},
		});
}
