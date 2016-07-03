test_manager.delete = function() {
	var formData = new FormData();
	formData.append("course_id", "{{course.id}}");
	formData.append("test_id", "{{test.id}}");

	formData.append('csrfmiddlewaretoken', '{{csrf_token}}');
	$.ajax({
		type:"POST",
		url:"/test/delete/",
		data: formData,
		processData: false,
		contentType: false,
		success: function(data) {
			notification.show('success', data);
			window.history.pushState('Test {{test.id}}', 'Test {{test.id}}', '/test/edit/?course_id={{course.id}}&test_id={{test.id}}');
		}
	});
}