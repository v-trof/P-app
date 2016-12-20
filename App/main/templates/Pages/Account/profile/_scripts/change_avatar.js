
$(document).ready(function() {
  $new_avatar = $('<input type="file" hidden>') 
  $("body").append($new_avatar);

  $("#change_avatar").click(function(e) {
    $new_avatar.click();
  });

  $new_avatar.change(function(e) {
    var file = e.target.files[0];
    var formData = new FormData();
    formData.append('new_avatar', file);
    formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');
    $.ajax({
      type: "POST",
      url:  "/func/upload_avatar/",
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        $(".__user-avatar, .__avatar").attr('src', response);
        notification.show('success', "Аватар успешно изменен");
      },
      error: function(response) {
        notification.show('error', "Произошла ошибка");
      },
  });
  });
});
  
