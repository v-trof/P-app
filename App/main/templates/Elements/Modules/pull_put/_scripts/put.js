pull_put.put_zone = (function() {

	var exports = {
		add: function($element, _action, _callback) {
			$element = $($element).first(); //fault-tolerance
			$element.addClass('m--put-zone');
			
			$element.click(function(event) {
				if(pull_put.is_pulled && ! pull_put.ui.$.find(($(this)))[0]) {

					var $put_zone = $(this);
					// console.log($put_zone);
					_action(event, $put_zone, pull_put.ui.element);
					
					// pull_put.reset();

					// console.log($put_zone);
					if(_callback) {
						_callback($put_zone);
					}
				}		
			});			
		}
	}

	return exports;
})();
