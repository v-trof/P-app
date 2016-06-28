scroll = {
	wire: function($trigger, $destination) {

		var header_height = $(".header").height();
		$trigger = $($trigger);
		$destination = $($destination).first();

		$trigger.click(function(event) {
			$.scrollTo($destination, 300, {offset:-header_height});
		});
	}
}