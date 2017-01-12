$( "#button_import" ).click(function() {
  console.log('sfdf')
  var form_data = new FormData();
  var type=$(this).attr("data-type");
  console.log(this)
  form_data.append('csrfmiddlewaretoken', '{{ csrf_token }}');
  form_data.append('course_id', '{{course.id}}');
  form_data.append('index', $(this).attr("data-index"));
  //add more data
  $.ajax({
    type:"POST",
    url:"/func/take_shared/",
    data: form_data,
    processData: false,
    contentType: false,
     success: function(response) {
      if(response && response["type"]) {
        notification.show(response["type"], response["message"]);
      } else {
        notification.show('success', 'Тест добавлен' );
      }
    }
  });
   $(this).closest(".card").hide();
});
$( "#button_delay" ).click(function() {
  var form_data = new FormData();
  form_data.append('csrfmiddlewaretoken', '{{ csrf_token }}');
  form_data.append('index', $(this).attr("data-index"));
  form_data.append('course_id', "{{course.id}}");
  $.ajax({
    type:"POST",
    url:"/func/delete_info",
    processData: false,
    contentType: false,
    data: form_data
  });
 $(this).closest(".card").hide();
});