var button_delete = (function(){
	var template = '{% include "Elements/Modules/button_delete/exports.html" %}';

	var exports = {
		add: function($element, $deletable, _callback) {
			//if callback passed second
			if(typeof $deletable === 'function') {
				_call_back = $deletable;
				$deletable = undefined;
			}

			if(typeof $deletable === 'undefined') {
				$deletable = $element;
			}

			$element = $element.first();

			$button = $(template);

			$element.append($button);
			
			$button.click(function(event) {
				$deletable.remove();
				if(_callback) {
					_callback();
				}
			});
		}
	}

	return exports;
})();