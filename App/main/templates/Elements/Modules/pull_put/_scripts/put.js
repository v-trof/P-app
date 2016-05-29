pull_put.put_zone = (function() {

	var exports = {
		add: function($element, _action, _callback) {
			$element = $($element).first(); //fault-tolerance
			$element.addClass('--put-zone');
			
			$element.click(function(event) {
				if(pull_put.is_pulled && ! pull_put.ui.$.find(($(this)))[0]) {

					_action(event, $(this), pull_put.ui.element);
					
					// pull_put.reset();

					if(_callback) {
						_callback();
					}
				}		
			});			
		}
	}

	return exports;
})();
