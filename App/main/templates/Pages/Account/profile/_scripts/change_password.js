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
			if (response=="success")
				notification.show('success','Ссылка для подтверждения смены пароля отправлена вам на почту');
			else notification.show('error','Произошла ошибка');
		},
		error: function(data) {
			notification.show('error', data);
		}
	});
});
	});
});