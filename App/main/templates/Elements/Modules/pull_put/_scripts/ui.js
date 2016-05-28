pull_put.ui = (function() {

	$ui = $('{% include "Elements/Modules/pull_put/exports.html" %}');
	
	$ui.__actions__additional = $ui.find(".__actions>.__additional");
	$ui.__content = $ui.find(".__content");

	function make_button(icon, tip, _action) {
		var $button = $('<div class="card --circle" tip="'
			+ tip + '">'
			+'<button class="--ghost --icon">'
			+ icon
			+'</button></div>');
		$button.click(function(event) {
			_action(event);
		});

		return $button;
	}


	exports = {
		added_card: false,
		$: $ui,
		element: undefined,
		add_action: function(icon, tip, _action) {
			
			if(typeof icon === "object") {
				var action_obj = icon;
				icon = action_obj.icon;
				tip = action_obj.tip;
				_action = action_obj._action; 
			} 

			$new_button = make_button(icon, tip, _action);

			$ui.__actions__additional.html($new_button);
		},
		get: function($element, element_width, actions, _callback, card) {
			
			if(card){
				$ui.__content.addClass('card');
			} else {
				$ui.__content.removeClass('card');
			}

			$ui.__content.html($element);
			$ui.__actions__additional.html("");

			$ui.css("margin-left", -element_width/2)
			$ui.__content.css("width", element_width)

			pull_put.ui.element = $element;

			if(actions.indexOf("delete")>-1) {
				$ui.find(".__actions button.--delete").parent().show();
			} else {
				$ui.find(".__actions button.--delete").parent().hide();
			}

			if(actions.indexOf("add")>-1) {
				$ui.find(".__actions button.--add").parent().show();
			} else {
				$ui.find(".__actions button.--add").parent().hide();
			}

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
		pull_put.reset();
	});

	$(".pull_put_ui .__actions .--add").click(function(event) {
		generate.build.task(pull_put.ui.element);
		pull_put.reset();
	});
});