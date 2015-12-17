"use strict";
function build_header(){
	var breadcumbs_w = $(".header__breadcumbs").innerWidth();
	var user_w = $(".header__user").innerWidth();
	console.log(user_w,breadcumbs_w);
	if(breadcumbs_w>user_w){
		$(".header__user").css('min-width', breadcumbs_w+10+"px");
		$(".header__breadcumbs").css('min-width', breadcumbs_w+10+"px");
		user_w=breadcumbs_w;
	} else {
		$(".header__breadcumbs").css('min-width', user_w+10+"px");
		$(".header__user").css('min-width', user_w+10+"px");
		breadcumbs_w=user_w;
	}
	console.log(user_w,breadcumbs_w);
	$(".header__search").css("width","100%");
}



$(document).ready(function() {
	build_header();
});


/*function fade(){
	$("h1,h2,h3,h4,h5,h6").css('animante', 'value');
}*/