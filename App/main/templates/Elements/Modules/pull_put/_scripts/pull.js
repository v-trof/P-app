if(typeof pull_put === 'undefined') {
	pull_put = {}
}

pull_put.puller = (function() {

	$placeholder = $("<div class='--pull_put_empty'></div>")

	function replace($element) {
		if(pull_put.ui.element) {
			pull_put.puller.cancel();
		}

		$placeholder.css({
			width: $element.outerWidth(),
			height: $element.outerHeight(),
			margin: $element.css("margin")
		});

		$element.after($placeholder);
	}

	
	exports = {
		cancel: function() {
			$placeholder.replaceWith(pull_put.ui.element);
			pull_put.ui.element = undefined;
			pull_put.ui.hide();
		},

		add: function($element, action_additional, _callback) {
			$element = $($element).first(); //fault-tolerance
			$element.addClass('--pullable');
			$element.click(function(event) {				
				replace($element);
								
				pull_put.ui.get($element, _callback);
				
				if(action_additional) {
					pull_put.ui.add_action(action_additional);
				}

				pull_put.ui.show();
			});
		}
	}
	return exports;

})();