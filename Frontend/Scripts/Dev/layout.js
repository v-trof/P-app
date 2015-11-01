"use strict";
function build_header(){
	var breadubs_w = $(".header__breadcumbs").innerWidth();
	var user_w = $(".header__user").innerWidth();
	var header_w = $(".header").innerWidth();
	if(breadubs_w>user_w){
		$(".header__user").css('width', breadubs_w+"px");
		$(".header__breadcumbs").css('width', breadubs_w+"px");
		user_w=breadubs_w;
	} else {
		$(".header__breadcumbs").css('width', user_w+"px");
		$(".header__user").css('width', user_w+"px");
		breadubs_w=user_w;
	}
	
	$(".header__search").css("width","100%");
	$(".header__search").css('opacity', '1');
}

$(document).ready(function() {
	build_header();
});
