function header_build() {
	$(".header>.__breadcrumbs").removeAttr('style');
	$(".header>.__user").removeAttr('style');
	
	var breadcrumbs_width = $(".header>.__breadcrumbs").innerWidth();
	var user_width = $(".header>.__user").innerWidth();
	
	if(breadcrumbs_width > user_width) {
		breadcrumbs_width += 10;
		user_width = breadcrumbs_width;
	} else {
		user_width += 10;
		breadcrumbs_width = user_width;
	}

	$(".header>.__breadcrumbs").css('width', breadcrumbs_width+10+"px");
	$(".header>.__user-info").css('width', user_width+10+"px");
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
})