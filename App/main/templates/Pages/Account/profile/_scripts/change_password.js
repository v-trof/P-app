function request_password_change(passwords) {
	$.ajax({
		type:"POST",
		url:"/func/change_password/",
		data: {
			'old_password': passwords.old,
			'csrfmiddlewaretoken': '{{ csrf_token }}',
			'new_password': passwords.new
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
				var passwords = {
					old: popup.$.find(".__password-old").val(),
					new: popup.$.find(".__password-new").val()
				}
				request_password_change(passwords);
			});
		});
	});
});