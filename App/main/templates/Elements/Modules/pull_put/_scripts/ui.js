pull_put.ui = (function() {

	$ui = $('{% include "Elements/Modules/pull_put/exports.html" %}');
	
	$ui.__actions__additional = $ui.find(".__actions__additional");
	$ui.__content = $ui.find(".__content");

	function make_button(icon, tip, _action) {
		var $button = $('<div class="card --circle" tip="'
			+ tip +
			+'"> <button class="--ghost --icon" ">'
			+ icon +
			"</button></div>");
		$button.click(function(event) {
			_action(event);
		});
	}


	exports = {
		$: $ui,
		element: undefined,
		add_action: function(icon, tip, _action) {
			$new_button = make_button(icon, tip, _action);
			$ui.__actions__additional.append($new_button);
		},
		get: function($element, _callback) {
			element_width = $element.outerWidth();

			$ui.__content.html($element);
			$ui.__actions__additional.html("");

			$ui.css("margin-left", -element_width/2)
			$element.css("min-width", element_width)

			pull_put.ui.element = $element;

			if(_callback) {
				_callback();
			}
		},
		show: function() {
			$ui.removeClass('--hidden');
			setTimeout(function(){
				pull_put.is_pulled = true;
			}, 300)
			
		},
		hide: function() {
			$ui.addClass('--hidden');
			setTimeout(function(){
				pull_put.is_pulled = false;
			}, 300)
		}
	} 
	return exports;
})();

$(document).ready(function() {
	$("body").append(pull_put.ui.$)

	$(".pull_put_ui .__actions .--cancel").click(function(event) {
		pull_put.puller.cancel();
	});

	$(".pull_put_ui .__actions .--delete").click(function(event) {
		pull_put.ui.element = "";
		pull_put.puller.cancel();
	});
});