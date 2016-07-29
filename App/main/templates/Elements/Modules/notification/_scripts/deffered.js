{% for notification in request.session.notifications %}
  {% if notification.type %}
    notification.show(
        '{{notification.type}}',
        '{{notification.message}}'
    );
  {% else %}
    notification.show('success', '{{notification.text}}');
  {% endif %}
	$.ajax({
	type:"POST",
	url:"/func/delete_notification/",
	data: {
	   'csrfmiddlewaretoken': '{{ csrf_token }}'
	},
	success: function(response) {
	}
	});
{% endfor %}
