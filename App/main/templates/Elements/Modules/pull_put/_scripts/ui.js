pull_put.ui = (function() {

	$ui = $('{% include "Elements/Modules/pull_put/exports.html" %}');
	
	$ui.__actions__additional = $ui.find(".__actions>.__additional");
	$ui.__content = $ui.find(".__content");

	function make_button(icon, tip, _action) {
		var $button = $('<div class="card m--circle" tip="'
			+ tip + '">'
			+'<button class="m--ghost m--icon">'
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
		proto_element: undefined,
		additional_margin: 0,
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
			if(typeof actions === "undefined") {
				actions = []
			}

			$ui.removeAttr('style');

			if(card) {
				$ui.__content.addClass('card');
			} else {
				$ui.__content.removeClass('card');
			}

			$ui.__content.html($element);
			$ui.__actions__additional.html("");

			$ui.css("margin-left", -element_width/2 
					+ pull_put.ui.additional_margin)
			$ui.__content.css("width", element_width 
					- pull_put.ui.additional_margin)

			pull_put.ui.element = $element;

			

			if(actions.indexOf("delete")>-1) {
				$ui.find(".__actions button.m--delete").parent().show();
			} else {
				$ui.find(".__actions button.m--delete").parent().hide();
			}

			if(actions.indexOf("add")>-1) {
				$ui.find(".__actions button.m--add").parent().show();
			} else {
				$ui.find(".__actions button.m--add").parent().hide();
			}

			if(actions.indexOf("save")>-1) {
				pull_put.ui.proto_element = $element.clone();
				$ui.find(".__actions button.m--save").parent().show();
			} else {
				pull_put.ui.proto_element = $element;
				$ui.find(".__actions button.m--save").parent().hide();
			}

			if(_callback) {
				_callback();
			}

			pull_put.ui.show(element_width);
		},
		show: function(element_width) {
			if(typeof editor !== "undefined") {
				$(".__task").slice(-2).addClass("m--stand-out");
				$(".__put-margin").last().addClass("m--stand-out");
			}
			$ui.removeClass('m--hidden');

			setTimeout(function() {
				pull_put.is_pulled = true;

				var screen_width = window.innerWidth;
				var dropout = ($ui.width() - element_width/2
					 + pull_put.ui.additional_margin) -screen_width/2;

				if(dropout > 0) {
					$ui.css('right', '16px');
				}

			}, 300)
			
		},
		hide: function() {
			if(typeof editor !== "undefined") {
				$(".m--stand-out").removeClass("m--stand-out");
			}
			$ui.addClass('m--hidden');
			setTimeout(function() {
				pull_put.is_pulled = false;
			}, 300)
		}
	}
	return exports;
})();

$(document).ready(function() {
	$("body").append(pull_put.ui.$)

	$(".pull_put_ui .__actions .m--cancel").click(function(event) {

		//restoring defaut element
		pull_put.ui.element = pull_put.ui.proto_element;

		pull_put.puller.cancel();
	});

	$(".pull_put_ui .__actions .m--save").click(function(event) {
		pull_put.puller.cancel();
	});

	$(".pull_put_ui .__actions .m--delete").click(function(event) {
		pull_put.ui.element = $("");
		pull_put.reset();
		pull_put.delete_action();
	});

	$(".pull_put_ui .__actions .m--add").click(function(event) {
		generate.build.task(pull_put.ui.element);
		pull_put.reset();
	});
});
