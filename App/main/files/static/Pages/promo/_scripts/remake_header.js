$(document).ready(function() {
  var $start = $('<span>Pileus</span>');
  var $funcs = $('<span>Возможности</span>');
  var $contact = $('<span>Контакты</span>');

  $start.click(function() {
    scroll.wire($start, $('.above-the-flood'));
    scroll.wire($funcs, $('.functions'));
    scroll.wire($contact, $('.contacts'));
  });

  $start.click();

  $('.__search').hide();
  $('.__breadcrumbs').html('').append([$start, $funcs, $contact]);
});
