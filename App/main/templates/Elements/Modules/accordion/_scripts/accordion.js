var accordion = (function() {
	
	toggle_template = '<button class="--ghost --icon --accordion-toggle">'
		+'{% include "Elements/Icons/angle_down.svg" %}</button>';

	function expand($element, $indicator) {
		$element.children().removeClass('--accordion-hidden');
		$element.children('.--accordion-toggle').first()
			.removeClass('--accordion-minimized')
			.removeAttr('style');
	}

	function minimize($element, $indicator) {
		$element.children().addClass('--accordion-hidden');
		
		$indicator.removeClass('--accordion-hidden');

		$element.children('.--accordion-toggle').first()
			.removeClass('--accordion-hidden')
			.addClass('--accordion-minimized');
	}

	exports = {
		add: function($element, indicator) {
			var $indicator = $element.find(indicator).first();

			var $toggle = $(toggle_template);
			$element.prepend($toggle);

			$toggle.click(function(event) {
				if($(this).hasClass('--accordion-minimized')) {
					expand($element, $indicator);
				} else {
					minimize($element, $indicator);
				}
			});

		}
	}
	return exports;
})();