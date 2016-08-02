function show_active_test(id) {
  $('.linkbox').find('.--active').removeClass('--active');
  $('.linkbox').find('#'+id).addClass('--active');

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
