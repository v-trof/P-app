$('#finish').click(function(){
	$.ajax({
		type:"POST",
		url:'../attempt/check/',
		data: {
			'test_id':"{{test.id}}",
			'course_id':"{{course.id}}",
			'csrfmiddlewaretoken':"{{ csrf_token }}"
		},
		success: function(){
			notification.show('success', 'Тест проверен системой' );
			window.location = 'test/attempt/results?course_id={{course.id}}&test_id={{test.id}}';
		},
		});
})