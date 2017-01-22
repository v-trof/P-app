share.ajax.unshare = function(share_data) {
  var form_data = new FormData();
  console.log("ddd")
  form_data.append('course_id',django.course.id);
  form_data.append('shared_id',share_data.shared_id);
  form_data.append('csrfmiddlewaretoken', loads.csrf_token);
  $.ajax({
    type:"POST",
    url:"/func/unshare/",
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
