test_manager.save = function() {
	var test_packed = test_manager.pack();

	var formData = new FormData();

		formData.append("json_file", test_packed);
		formData.append("course_id", "{{course.id}}");
		formData.append("test_id", "{{test.id}}");
		formData.append('csrfmiddlewaretoken', '{{csrf_token}}');
		$.ajax({
			type:"POST",
			url:"/test/save/",
			data: formData,
			processData: false,
			contentType: false,
			success: function(data) {
				notification.show('success', data);
				window.history.pushState('Test {{test.id}}', 'Test {{test.id}}', '/test/edit/?course_id={{course.id}}&test_id={{test.id}}');
			}
		});
}