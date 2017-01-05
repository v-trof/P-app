function header_build() {
  $(".header>.__breadcrumbs").removeAttr('style');
  $(".header>.__user").removeAttr('style');

  var breadcrumbs_width = $(".header>.__breadcrumbs").innerWidth();
  var user_width = $(".header>.__user-info").innerWidth();

  console.log('b', breadcrumbs_width, 'u', user_width, 'm', max_width);

  $(".header>.__breadcrumbs").css('width', max_width+10+"px");
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
