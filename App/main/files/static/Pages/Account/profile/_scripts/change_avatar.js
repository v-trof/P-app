
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
      upload(
        formData,
        "/func/upload_avatar/",
        function(response) {
          $(".__user-avatar, .__avatar").attr('src', response);
      });
  });
});
  
