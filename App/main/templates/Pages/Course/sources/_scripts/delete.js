function delete_source(source_id) {
	var form_data = new FormData(source_id);
	form_data.append('csrfmiddlewaretoken', '{{ csrf_token }}');
	form_data.append('course_id ', '{{course.id}}');
	form_data.append('source_id ', source_id);
	
	$.ajax({
		url: '/func/delete_source/',
		type: 'POST',
		data: form_data,
		processData: false,
	    contentType: false,
	}).success(function() {
		notification.show("success", "Источник удалён")
	})
}