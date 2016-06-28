test_manager.unpublish = function() {
	var formData = new FormData();
	formData.append("course_id", "{{course.id}}");
	formData.append("test_id", "{{test.id}}");
	formData.append('csrfmiddlewaretoken', '{{csrf_token}}');
	$.ajax({
		type:"POST",
		url:"/test/unpublish/",
		data: formData,
		processData: false,
		contentType: false,
		success: function(data) {
			notification.show('success', data);
		}
	});
	$("#test_publish").show();
	$("#test_unpublish").hide();
}