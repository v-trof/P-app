$( "#button_accept" ).click(function() {
  console.log('sfdf')
  var form_data = new FormData();
  var type=$(this).attr("data-type");
  form_data.append('csrfmiddlewaretoken', '{{ csrf_token }}');
  form_data.append('course_id', '{{course.id}}');
  form_data.append('user_id', $(this).attr("data-user-id"));
  if (type=="reset")
    form_data.append('test_id', $(this).attr("data-test-id"));

  $.ajax({
    type:"POST",
    url:"/func/accept_"+type+"/",
    data: form_data,
    processData: false,
    contentType: false,
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
$( "#button_decline" ).click(function() {
  var form_data = new FormData();
  var type=$(this).attr("data-type");
  form_data.append('csrfmiddlewaretoken', '{{ csrf_token }}');
  form_data.append('course_id', '{{course.id}}');
  form_data.append('user_id', $(this).attr("data-user-id"));
  if (type=="reset")
    form_data.append('test_id', $(this).attr("data-test-id"));
  $.ajax({
    type:"POST",
    url:"/func/decline_"+type+"/",
    processData: false,
    contentType: false,
    data: form_data,
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
