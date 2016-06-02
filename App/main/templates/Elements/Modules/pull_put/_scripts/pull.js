pull_put.puller = (function() {

	$placeholder = $("<div class='--pull_put_empty'></div>")

	function replace($element) {
		if(pull_put.ui.element) {
			pull_put.puller.cancel();
		}

		$placeholder.css({
			width: $element.outerWidth(),
			height: $element.outerHeight(),
			marginBottom: $element.css("margin-bottom"),
			marginTop: $element.css("margin-top"),
			marginLeft: $element.css("margin-left"),
			marginRight: $element.css("margin-right")
		});
		
		$element.after($placeholder);
	}

	
	exports = {
		had_clone: false,
		cancel: function() {

			$placeholder.replaceWith(pull_put.ui.element);
			pull_put.reset();
		},

		add: function($element, actions, action_additional, _callback, clone, card) {
			
			$element = $($element).first(); //fault-tolerance
			
			$element.addClass('--pullable');

			$element.click(function(event) {
				if( ! pull_put.is_pulled) {
					element_width = $(this).outerWidth();

					if (clone) {	
						var $element = $(this).clone();
						pull_put.puller.had_clone = true;
					} else {
						var $element = $(this);
						replace($element);
					}
									
					pull_put.ui.get($element, element_width, actions, _callback, card);
					
					if(action_additional) {
						pull_put.ui.add_action(
							action_additional.icon,
							action_additional.tip,
							action_additional._action
						);
					}

					pull_put.ui.show();
				}
			});
		}
	}
	return exports;

})();