$('#confirm').click(function() {
		{% if type == "email" %}
			$.ajax({
					type:"POST",
					url:"/func/approve_email/",
					data: {
					'password': $( "input[name$='password']" ).val(),
					'code': "{{code}}",
					'user_id': "{{user.id}}",
					'type':"{{type}}",
					'requesting_data':"{{requesting_data}}",
					'csrfmiddlewaretoken' : '{{ csrf_token }}'
						},
					success: function(response) {
							notification.show(response["type"], response["message"]);
							if (response["type"] == "success") {
								window.location.href = '/';
							}	else {
								notification.show('error',response);
							}
					}
				});
		{% else %}
				$.ajax({
					type:"POST",
					url:"/func/approve_password/",
					data: {
					'type':"{{type}}",
					'code': "{{code}}",
					'user_id': "{{user.id}}",
					'new_password': $( "input[name$='password']" ).val(),
					'csrfmiddlewaretoken' : '{{ csrf_token }}'
						},
					success: function(response) {
							notification.show(response["type"], response["message"]);
							if (response["type"] == "success") {
								window.location.href = '/';
							}	else {
								notification.show('error',response);
							}
					}
						});
		{% endif %}
		});
