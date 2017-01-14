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
      type:"POST",
      url:"/func/reg/",
      data: {
        'email': $( "input[name$='email']" ).val(),
        'name_last_name': $( "input[name$='name_last_name']" ).val(),
        'password': $( "input[name$='password']" ).val(),
        'is_teacher': true,
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

$(document).ready(function() {
  var $reg = $('.register');

  function position_reg_box() {
    if(window.innerWidth >= 1024) {
      $('body').append($reg);
    } else {
      $('.above-the-flood .row').append($reg)
    }
  }

  window.onresize = position_reg_box;
  position_reg_box();
});
