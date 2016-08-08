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
			                  	window.location.href='/'
			                  }
			                  else
			                  {
			                  	notification.show('error',response["message"]);
			                  }
			                               }
			            });
		});