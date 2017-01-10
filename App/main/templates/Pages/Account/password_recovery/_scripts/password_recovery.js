$('#reset_password').click(function() {
        var email = $( "input[name$='email']" ).val();
        $.ajax({
          type:"POST",
          url:"/func/reset_password/",
          data: {
            'email': email,
            'csrfmiddlewaretoken' : '{{ csrf_token }}'
              },
          success: function(response) {
            if (response["type"] == "success")
            {
              notification.show('success','Ссылка на сброс пароля отправлена вам на почту');
              
            }
            else
            {
              notification.show('error',response["message"]);
            }
            change_message(email);
          }
      });
    });
