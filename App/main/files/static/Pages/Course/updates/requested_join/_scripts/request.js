// console.log('{{ user.id }}')
$( "#button_accept_join" ).click(function() {
  $.ajax({
    type:"POST",
    url:"/func/accept_request/",
    data: {
         'user_id': $(this).attr("data-user-id"),
         'csrfmiddlewaretoken': '{{ csrf_token }}',
         'course_id': "{{course.id}}"
        },
     success: function(response) {
      if(response && response["type"]) {
        notification.show(response["type"], response["message"]);
      } else {
        notification.show('success', 'Заявка принята' );
      }
    }
  });
  $(this).closest(".card").hide();
});
$( "#button_decline_join" ).click(function() {
  $.ajax({
    type:"POST",
    url:"/func/decline_request/",
    data: {
         'user_id': $(this).attr("data-user-id"),
         'csrfmiddlewaretoken': '{{ csrf_token }}',
         'course_id': "{{course.id}}",
        },
    success: function(response) {
      if(response && response["type"]) {
        notification.show(response["type"], response["message"]);
      } else {
        notification.show('success', 'Заявка отклонена' );
      }
    }
  });
  $(this).closest(".card").hide();
});
