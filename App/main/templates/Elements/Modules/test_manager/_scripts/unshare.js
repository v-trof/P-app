test_manager.unshare = function() {
  var type="{{type}}";
    	var formData = new FormData();
   		formData.append("course_id", "{{course.id}}");
		formData.append("type", type);
		{% if type == 'test' %}
			formData.append("item_id", "{{test.id}}");
			formData.append("shared_id", "{{test.json.shared_id}}");
		{% else %}
			formData.append("item_id", "{{material.id}}");
			formData.append("shared_id", "{{material.json.shared_id}}");
		{% endif %}
		formData.append('csrfmiddlewaretoken', '{{csrf_token}}');

        $.ajax({
		type:"POST",
		url:"/func/unshare/",
		data: formData,
		processData: false,
		contentType: false,
		success: function(response) {
			console.log(response)
			notification.show(response["type"], response["message"]);
		}
	});
  $("#{{type}}_share").show();
  $("#{{type}}_unshare").hide();
}
