$('#register').click(function() {
    $.ajax({
      type:"POST",
      url:"/func/reg/",
      data: {
        'email': $( "input[name$='email']" ).val(),
        'name_last_name': $( "input[name$='name_last_name']" ).val(),
        'password': $( "input[name$='password']" ).val(),
        'is_teacher': True,
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
            notification.show(response["type"], response["message"]);
            }
     }
        });
    });