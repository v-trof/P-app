{% if not attempt and not read %}
test_manager.unpublish = function() {
	var formData = new FormData();
	formData.append("course_id", "{{course.id}}");
	{% if type == 'test' %}
		formData.append("test_id", "{{test.id}}");
	{% else %}
		formData.append("material_id", "{{material.id}}");
	{% endif %}
	formData.append('csrfmiddlewaretoken', '{{csrf_token}}');
	$.ajax({
		type:"POST",
		url:"/{{type}}/unpublish/",
		data: formData,
		processData: false,
		contentType: false,
		success: function(data) {
			notification.show('success', data);
		}
	});
	$("#{{type}}_publish").show();
	$("#{{type}}_unpublish").hide();
}
{% endif %}