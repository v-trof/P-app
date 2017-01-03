function upload(formData, url, _callback) {
  formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');

  if (typeof success === "undefined") {
    success = "Выполнено";
  }
  $.ajax({
    type: "POST",
    url: url,
    data: formData,
    processData: false,
    contentType: false,
    success: function(response) {
      _callback(response);
      // notification.show(response["type"], response["message"]);
    },
    error: function(response) {
      _callback(response);
      notification.show('error', "Произошла ошибка");
    },
  });
}
