$('#login').click(function() {
  var $pass = $("input[name$='password']");
  var $email = $("input[name$='email']");
  var data_ok = true;

  if( ! verifier.verify($pass, verifier.expressions.password)) {
    data_ok = false;
    notification.show('warning', 'Проверьте формат пароля');
  }

  if( ! verifier.verify($email, verifier.expressions.email)) {
    data_ok = false;
    notification.show('warning', 'Проверьте формат email');
  }

  if( ! data_ok) return;

  $.ajax({
    type:"POST",
    {% if course.id %} url:"/func/login/{{course.id}}/",
    {% else %}  url:"/func/login/",
    {% endif %}
    data: {
      'password': $pass.val(),
      'email': $email.val(),
      'csrfmiddlewaretoken' : '{{ csrf_token }}'
    },
    success: function(response) {
      if (response["type"] == "success") {
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
