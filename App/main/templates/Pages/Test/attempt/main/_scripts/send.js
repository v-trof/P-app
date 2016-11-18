var attempt = attempt || {}

attempt.append_send = function(index, value, _success_cb, _error_cb) {
  var $send_button = $("<button>Сдать тест</button>");

  $('.preview >.__content').append($send_button);

  $send_button.click(function() {
    //GET-HERE-AJAX for attempt send
  });
}

attempt.send_value = function(index, value) {
  //GET-HERE-AJAX for field send
}
