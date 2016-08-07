function show_active_test(id) {
  $('.linkbox').find('.m--active').removeClass('m--active');
  $('.linkbox').find('#'+id).addClass('m--active');

  //preview \ summary
  var $summary = $('.summary');
  var $preview = $('.preview');
  if(parseInt(id) > 0) {
    $preview.show();
    $summary.hide();
  } else {
    $preview.hide();
    $summary.show();
  }
}
