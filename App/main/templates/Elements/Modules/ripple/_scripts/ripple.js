var ripple = (function() {
	var $ripple = $('<div id="ripple_effect"></div>');
	
	function reset() {
		$ripple.removeAttr('style');
		$(".ripple_target").removeClass("ripple_target");
	}

	exports = {
		$: $ripple,
		show: function($element, position, css) {
			// console.log("ripple:", $element, position);
			reset();
			$element.append($ripple);
			$element.addClass('ripple_target');

			var radius = Math.max($element.width(), $element.height()) * Math.PI;

			$ripple.css({
				width: radius,
				height: radius
			})

			position.left -= radius/2
			position.top -= radius/2

			$ripple.css(position);

			if(typeof css !== 'undefined') {
				$ripple.css(css);
			}

			$ripple.addClass('--shown');
		}
	}
	return exports;
})();


$(document).ready(function() {
	$("body").on(
		"mousedown", "button", function(e) {
			var element_rect = this.getBoundingClientRect();
			var position = {
				left: e.clientX - element_rect.left,
				top: e.clientY - element_rect.top
			}
			ripple.show($(this), position);
	});
});