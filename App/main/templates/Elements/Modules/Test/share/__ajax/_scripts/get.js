share.ajax.get = function(share_data) {
  var form_data = new FormData();
  form_data.append('course_id',django.course.id);
  if (django.test_id)
  {
  	form_data.append('type',"test");
  	form_data.append('item_id',django.test_id);
  }
  else{
  	form_data.append('type',"material");
  	form_data.append('item_id',django.material_id);
  }
  form_data.append('shared_id',share_data.shared_id);
  form_data.append('csrfmiddlewaretoken', loads.csrf_token);
  $.ajax({
    type:"POST",
    url:"/func/take_shared/",
    data: form_data,
    processData: false,
      contentType: false,
     success: function(response) {
      if(response && response["type"]) {
          notification.show(response["type"], response["message"]);
      }
    }
});
}