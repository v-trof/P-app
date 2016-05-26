pull_put.put_zone = (function() {

	var exports = {
		add: function($element, _action, _callback) {
			$element = $($element).first(); //fault-tolerance
			$element.addClass('--put-zone');
			
			$element.click(function(event) {
				if(pull_put.is_pulled) {	
					_action(event, $element);
					$placeholder.remove();
					pull_put.ui.element = undefined;
					pull_put.ui.hide();
				}		
			});

			if(_callback) {
				_callback();
			}
		}
	}

	return exports;
})();


// pull_put.puller.add($(".card"));

pull_put.put_zone.add($(".card")[1], function(event, $element) {
	$element.after(pull_put.ui.element);
});