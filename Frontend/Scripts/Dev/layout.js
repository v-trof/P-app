"use strict";
function build_header(){
	var breadcumbs_w = $(".header__breadcumbs").innerWidth();
	var user_w = $(".header__user").innerWidth();
	var header_w = $(".header").innerWidth();
	if(breadcumbs_w>user_w){
		$(".header__user").css('width', breadcumbs_w+10+"px");
		$(".header__breadcumbs").css('width', breadcumbs_w+10+"px");
		user_w=breadcumbs_w;
	} else {
		$(".header__breadcumbs").css('width', user_w+10+"px");
		$(".header__user").css('width', user_w+10+"px");
		breadcumbs_w=user_w;
	}
	
	$(".header__search").css("width","100%");
	$(".header__search").css('opacity', '1');
}



$(document).ready(function() {
	build_header();
});


/*function fade(){
	$("h1,h2,h3,h4,h5,h6").css('animante', 'value');
}*/