$('#register').click(function() {
		$.ajax({
			type:"POST",
			url:"/func/reg/",
			data: {
			  'email': $( "input[name$='email']" ).val(),
			  'name_last_name': $( "input[name$='name_last_name']" ).val(),
			  'password': $( "input[name$='password']" ).val(),
			  'is_teacher': $( "input[name$='is_teacher']" ).is(":checked"),
			  {% if course %} 'course_reg': $( "input[name$='course_reg']" ).is(":checked"), 'course_id':{{course.id}}, {% endif %}
			  'csrfmiddlewaretoken' : '{{ csrf_token }}'
				},
			success: function(response){
					  if (response == "success" || response == "groups")
					  {
						window.location.href='/'
					  }
					  else
					  {
						notification.show('error',response);
					  }
								   }
				});
		});