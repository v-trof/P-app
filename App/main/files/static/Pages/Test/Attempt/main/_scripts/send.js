var attempt = attempt || {}

attempt.append_send = function() {
  var $send_button = $("<button>Сдать тест</button>");

  $('.preview >.__content').append($send_button);

  $send_button.click(function() {
    //GET-HERE-AJAX for attempt send
  });
}
