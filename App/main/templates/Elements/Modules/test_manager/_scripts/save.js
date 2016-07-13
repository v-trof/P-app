test_manager.save = function() {
	var test_packed = test_manager.pack();

	
	
	var formData = new FormData();

		formData.append("json_file", test_packed);
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
			success: function(data) {
				notification.show('success', data);
				{% if type == 'test' %}	
					window.history.pushState('Test {{test.id}}', 'Test {{test.id}}', '/test/edit/?course_id={{course.id}}&test_id={{test.id}}');
				{% else %}
					window.history.pushState('Material {{material.id}}', 'Material {{material.id}}', '/material/edit/?course_id={{course.id}}&material_id={{material.id}}');
				{% endif %}
			}
		});
}