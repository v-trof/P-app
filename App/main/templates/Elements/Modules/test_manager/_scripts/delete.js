{% if not attempt and not read %}
test_manager.delete = function() {
	var formData = new FormData();
	formData.append("course_id", "{{course.id}}");
	{% ifequal type "test" %}
		formData.append("test_id", "{{test.id}}");
	{% else %}
		formData.append("material_id", "{{material.id}}");
	{% endifequal %}

	formData.append('csrfmiddlewaretoken', '{{csrf_token}}');
	$.ajax({
		type:"POST",
		url:"/{{type}}/delete/",
		data: formData,
		processData: false,
		contentType: false,
		success: function(data) {
			notification.show('success', data);
			{% ifequal type "test" %}	
				window.history.pushState('Test {{test.id}}', 'Test {{test.id}}', '/test/edit/?course_id={{course.id}}&test_id={{test.id}}');
			{% else %}
				window.history.pushState('Material {{material.id}}', 'Material {{material.id}}', '/material/edit/?course_id={{course.id}}&material_id={{material.id}}');
			{% endifequal %}
		}
	});
}
{% endif %}