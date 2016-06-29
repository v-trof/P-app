function request_email_change(email) {
	// console.log(password, email);
	
	$.ajax({
		type:"POST",
		url:"/func/change_email/",
		data: {
			'csrfmiddlewaretoken': '{{ csrf_token }}',
			'new_email': email
			},
		success: function(response) {
			if (response=="success")
				notification.show('success','Вам на почту отправлено письмо для подтверждения');
			else notification.show('error','Email неверный');
		},
		error: function(data) {
			notification.show('error', data);
		}
	});
}

$(document).ready(function() {
	$('#change_email').click(function(e) {
		popup.show('{% include "Pages/Account/profile/_popup_texts/change_email/exports.html" %}',
		function() {
			// verifier.add(popup.$.find(".__email"), "email");
			popup.$.find(".__submit").click(function(e) {
				var email = popup.$.find(".__email").val();
				request_email_change(email);
			});
		});
	});
});