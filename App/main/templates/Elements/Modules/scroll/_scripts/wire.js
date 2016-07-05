scroll = {
	wire: function($trigger, $destination) {
		var margin = parseInt($(".main").css("margin-top"));
		
		$trigger = $($trigger);
		$destination = $($destination).first();

		$trigger.click(function(event) {
			$.scrollTo($destination, 300, {offset:-margin});
		});
	}
}