$(document).ready(function() {
	$('#change_password').click(function(e) {
		$(document).ready(function() {
		$.ajax({
		type:"POST",
		url:"/func/reset_password/",
		data: {
			'csrfmiddlewaretoken': '{{ csrf_token }}',
			'email': '{{request.user.username}}'
			},
		success: function(response) {
			notification.show(response["type"], response["message"]);
		},
		error: function(data) {
			notification.show('error', 'Произошла ошибка');
		}
	});
});
	});
});
