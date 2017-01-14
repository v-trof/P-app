$('#register').click(function() {
  var $name_last_name = $("input[name$='name_last_name']");
  var $pass = $( "input[name$='password']" );
  var $email = $( "input[name$='email']" );
  var data_ok = true;

  if( ! verifier.verify($pass, verifier.expressions.password)) {
    data_ok = false;
    notification.show('warning', 'Проверьте формат пароля');
  }

  if( ! verifier.verify($email, verifier.expressions.email)) {
    data_ok = false;
    notification.show('warning', 'Проверьте формат email');
  }

  if( ! verifier.verify($name_last_name, verifier.expressions.words2)) {
    data_ok = false;
    notification.show('warning', 'Проверьте формат имени');
  }

  if( ! data_ok) return;

  $.ajax({
    type: "POST",
    url: "/func/reg/",
    data: {
      'email': $email.val(),
      'name_last_name': $name_last_name.val(),
      'password': $pass.val(),
      'is_teacher': $( "input[name$='is_teacher']" ).is(":checked"),
      {% if course %}
        'course_reg': $( "input[name$='course_reg']" ).is(":checked"),
        'course_id':'{{course.id}}',
        {% if code %}
          'code':'{{code}}',
        {% endif %}
      {% endif %}
      'csrfmiddlewaretoken' : '{{ csrf_token }}'
    },
    success: function(response) {
      if (response["type"] === "success") {
        {% if request.session.last_page %}
          window.location.href = '{{request.session.lastpage}}';
          $.ajax({
            type: "POST",
            url: "/func/delete_last_page/",
            data: {
              'csrfmiddlewaretoken': '{{ csrf_token }}'
            }
          });
        {% else %}
          window.location.href = '/';
        {% endif %}
      } else {
        notification.show(response["type"], response["message"]);
      }
    }
  });
});
