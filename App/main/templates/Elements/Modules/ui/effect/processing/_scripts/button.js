if(typeof processing === 'undefined') {
	processing = {}
}

processing.button = {
	spinner : "<svg class='spinner' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'><circle cx='50' cy='50' r='38' fill='none' stroke-width='6' stroke-linecap='round'><animate attributeName='stroke-dashoffset' dur='2s' repeatCount='indefinite' from='0' to='476.9'></animate><animate attributeName='stroke-dasharray' dur='2s' repeatCount='indefinite' values='143.07 95.38;1 237.5;143.07 95.38'></animate></circle></svg>",
	start: function ($button) {
		$button = $($button).first()
		$button.attr("o-html", $button.html());
		var style = $button.attr('style');
		
		if(style) {
			$button.attr("o-style", style);
		}
		$button
			.css({
				"width": $button.outerWidth(),
				"height": $button.outerHeight(),
				"dispaly": "flex",
				"align-items": "center",
				"justifiy-content": "center"
			})
			.html(processing.button.spinner);
		$button.attr('disabled', 'disabled');
	},
	stop: function($button) {
		$button.html($button.attr("o-html"));
		$button.removeAttr('disabled');
		
		if($button.attr("o-style")) {
			$button.attr('style', $button.attr("o-style"));
		} else {
			$button.removeAttr('style');
		}
		$button.attr("o-style", undefined);
	},
}
