var button_delete = (function(){
	var template = '{% include "Elements/Modules/button_delete/exports.html" %}';

	var exports = {
		add: function($element, $deletable) {

			if(typeof $deletable === 'undefined') {
				$deletable = $element;
			}

			$element = $element.first();

			$button = $(template);

			$element.append($button);
			
			$button.click(function(event) {
				$deletable.remove();
			});
		}
	}

	return exports;
})();