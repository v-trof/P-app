share.ajax.share = function(share_data) {
  console.log('SHOULD HAVE SHARED', share_data);
  var form_data = new FormData();
  form_data.append('course_id',django.course.id);
  form_data.append('description',share_data.description);
  form_data.append('open',share_data.open);
  form_data.append('subject_tags',JSON.stringify(share_data.tags.subject));
  form_data.append('global_tags',JSON.stringify(share_data.tags.main));
  var share_query=[]
  if (share_data.assets.material)
  {
  	share_query.push('material');
  	form_data.append('material_id',share_data.assets.material_id);
  	if (share_data.assets.templates)
  		share_query.push('templates');
  }
  else if (share_data.assets.test)
  {
  	share_query.push('test');
  	form_data.append('test_id',share_data.assets.test_id);
  	if (share_data.assets.templates)
  		share_query.push('templates');
  }
  else if (share_data.assets.templates){
  	share_query.push('templates');
  	if (share_data.assets.test_id)
  		form_data.append('test_id',share_data.assets.test_id);
  	else form_data.append('material_id',share_data.assets.material_id);
  }
  form_data.append('share_query',JSON.stringify(share_query));
  if (share_data.shared_id)
  	form_data.append('shared_id',share_data.shared_id);
  form_data.append('csrfmiddlewaretoken', loads.csrf_token);
  $.ajax({
    type:"POST",
    url:"/func/share/",
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
