$('#login').click(function() {
				$.ajax({
			        type:"POST",
			        {% if course.id %} url:"/func/login/{{course.id}}/",
			        {% else %}  url:"/func/login/",
			        {% endif %}
			        data: {
			          'password': $( "input[name$='password']" ).val(),
			          'email': $( "input[name$='email']" ).val(),
			          'csrfmiddlewaretoken' : '{{ csrf_token }}'
			            },
			        success: function(response) {
			                  if (response["type"] == "success")
			                  {
			                  	{% if request.session.last_page %}
			                  		window.location.href='{{request.session.last_page}}'
			                  		$.ajax({
										type:"POST",
										url:"/func/delete_last_page/",
										data: {
										   'csrfmiddlewaretoken': '{{ csrf_token }}'
										}
										});
			                  	{% else %}
			                  		window.location.href='/'
			                  	{% endif %}
			                  }
			                  else
			                  {
			                  	notification.show('error',response["message"]);
			                  }
			                               }
			            });
		});