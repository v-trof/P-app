$(document).ready(function() {
  var $start = $('<a>Pileus</a>');
  var $funcs = $('<a>Возможноксти</a>');
  var $contact = $('<a>Контакты</a>');

  $('.__search').hide();
  $('.__breadcrumbs').html('').append([$start, $funcs, $contact]);
});
