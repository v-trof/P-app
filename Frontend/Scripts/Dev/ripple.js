var ripple = $("<div class='ripple'></div>");

ripple.dissolve = function (){
	ripple.css({
		"transform": "scale(0)",
		"opacity": 0,
		"transition-duration": "0"
	});
}

$(document).ready(function() {
	$(".link--card>.card, .link--card>.card--small, button").bind({
		mousedown: function(e) {
			$(this).prepend(ripple);
			var c_rect = this.getBoundingClientRect();
			var scale = (c_rect.width/5)*1.4;
			// console.log(scale);
			var time = scale * 12;
			// console.log(this.getBoundingClientRect(), e, $("main").scrollTop());
			var pos = {
				x: e.clientX - c_rect.left,
				y: e.clientY - c_rect.top - $("main").scrollTop()
			}
			// console.log(pos);
			ripple.css({
				"top": pos.y + "px",
				"left": pos.x + "px",
				"transform": "scale(" + scale + ")",
				"transition-duration": time + "ms",
				"opacity": 1
			});
		},

		mouseup: function() {
			ripple.dissolve();
		},
		mouseleave: function() {
			ripple.dissolve();
		},
	});
});