function request_password_change(passwords) {
	$.ajax({
		type:"POST",
		url:"/func/change_password/",
		data: {
			'csrfmiddlewaretoken': '{{ csrf_token }}',
			'password': password
			},
		success: function(response) {
			if (response=="success")
				notification.show('success','Пароль изменен');
			else notification.show('error','Пароль неверный');
		},
		error: function(data) {
			notification.show('error', data);
		}
	});
}

$(document).ready(function() {
	$('#change_password').click(function(e) {
		popup.show('{% include "Pages/Account/profile/_popup_texts/change_password/exports.html" %}',
		function() {
			popup.$.find(".__submit").click(function(e) {
				var password = popup.$.find(".__password").val();

				if(verifier.verify(
					popup.$.find(".__password"),
					verifier.expressions.password)
				) {
					request_password_change(password);
				} else {
					notification.show("error",
						'Минимум 8 символов');
				}
				
			});
		});
	});
});