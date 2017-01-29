function header_build() {
  $(".header>.__breadcrumbs").removeAttr('style');
  $(".header>.__user-info").removeAttr('style');
  $('.__back_btn').removeAttr('style');
  var $left;

  if(window.innerWidth > 768) {
    var $left = $(".header>.__breadcrumbs");
  } else {
    var $links = $(".header>.__breadcrumbs a");
    var $left = $(".header>.__back_btn");
    if($links.length > 2) {
      var $source =$links.eq(1);
    } else if($links.length == 2) {
      var $source = $links.eq(0);
    } else {
        $(".header>.__back_btn").hide();
        $('.header>.__search').addClass('m--first')
    }
    $(".header>.__back_btn>.__text").text($source.text());
    $(".header>.__back_btn").attr('href', $source.attr('href'));
  }

  var left_width = $left.innerWidth();
  var user_width = $(".header>.__user-info").innerWidth();
  var max_width = Math.max(left_width, user_width);

  console.log('l', left_width, 'u', user_width, 'm', max_width);

  $left.css('width', max_width+10+"px");
  $(".header>.__user-info").css('width', max_width+10+"px");
}

$(window).resize(function(event) {
  header_build();

  try {
    tooltip.hide();
  } catch(err) {}

  try {
    context_menu.hide();
  } catch(err) {}
});

$(document).ready(function() {
  header_build();
});
