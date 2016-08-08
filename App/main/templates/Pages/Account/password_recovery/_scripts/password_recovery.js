$('#reset_password').click(function() {
				$.ajax({
			        type:"POST",
			        url:"/func/reset_password/",
			        data: {
			          'email': $( "input[name$='email']" ).val(),
			          'csrfmiddlewaretoken' : '{{ csrf_token }}'
			            },
			        success: function(response) {
			                  if (response["type"] == "success")
			                  {
			                  	notification.show('success','Ссылка на сброс пароля отправлена вам на почту');
			                  }
			                  else
			                  {
			                  	notification.show('error',response);
			                  }
			                               }
			            });
		});
