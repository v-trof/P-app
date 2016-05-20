var accordion = (function() {
	
	toggle_template = '<button class="--ghost --icon --accordion-toggle">'
		+'{% include "Elements/Icons/arrow_down.svg" %}</button>';

	function expand($element, $indicator) {
		console.log($element);

		$element.children().removeClass('--accordion-hidden');
		$element.children('.--accordion-toggle').first()
			.removeClass('--accordion-minimized')
			.removeAttr('style');
	}

	function minimize($element, $indicator) {
		console.log($element);

		$element.children().addClass('--accordion-hidden');
		
		$indicator.removeClass('--accordion-hidden');
		$element.children('.--accordion-toggle').first()
			.removeClass('--accordion-hidden')
			.addClass('--accordion-minimized');


		$element.children('.--accordion-toggle').first()
			.css('margin-top', 
				-$element.children('.--accordion-toggle').first().height()/2);
	}

	exports = {
		add: function($element, indicator) {
			$indicator = $element.find(indicator).first();

			var $toggle = $(toggle_template);
			$element.prepend($toggle);



			$toggle.click(function(event) {
				if($(this).hasClass('--accordion-minimized')){
					expand($element, $indicator);
				} else {
					minimize($element, $indicator);
				}
			});

		}
	}
	return exports;
})();