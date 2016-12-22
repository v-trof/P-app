$('#send_mail').click(function() {
    $.ajax({
      type:"POST",
      url:"/func/send_mail/",
      data: {
        'email':$( ".instant-email" ).val(),
        'message_text':$( ".message" ).text(),
        'csrfmiddlewaretoken' : '{{ csrf_token }}'
        },
      success: function(response) {
            notification.show(response["type"], response["message"]);
     }
        });
    });