function header_build(){$(".header>.__breadcrumbs").removeAttr("style"),$(".header>.__user-info").removeAttr("style"),$(".__back_btn").removeAttr("style");var e;if(window.innerWidth>768)var e=$(".header>.__breadcrumbs");else{var r=$(".header>.__breadcrumbs a"),e=$(".header>.__back_btn");if(r.length>2)var t=r.eq(1);else if(2==r.length)var t=r.eq(0);else{var t=r.eq(0);$(".header>.__back_btn").hide(),$(".header>.__search").addClass("m--first")}var a=t.text();console.log("n_t",a.length),a&&a.length>11&&(a=a.substring(0,8)+"..."),$(".header>.__back_btn>.__text").text(a),$(".header>.__back_btn").attr("href",t.attr("href"))}var _=e.innerWidth(),d=$(".header>.__user-info").innerWidth(),n=Math.max(_,d);console.log("l",_,"u",d,"m",n),e.css("width",n+10+"px"),$(".header>.__user-info").css("width",n+10+"px")}$(window).resize(function(e){header_build();try{tooltip.hide()}catch(e){}try{context_menu.hide()}catch(e){}}),$(document).ready(function(){header_build()});