var button_delete = (function(){
	var template = '{% include "Elements/Modules/button_delete/exports.html" %}';

	var exports = {
		add: function($element, $deletable, _call_back) {
			console.log(typeof $deletable)
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
				_call_back();
			});
		}
	}

	return exports;
})();