generate.edit = (function() {
	
	var edit_action = {
		icon: '{% include "Elements/Icons/edit.svg"  %}',
		tip: 'Редактировать',
		_action: function() {
			generate.edit.start();
		}
	}

	var preview_action = {
		icon: '{% include "Elements/Icons/visibility.svg"  %}',
		tip: 'Показать элемент',
		_action: function() {
			generate.edit.stop();
		}
	}


	var exports = {
		start: function() {
			pull_put.ui.$.find(".__content").attr('state', 'edit'); 
			indicator.show(1);
			var $element = pull_put.ui.element;
			
			var element_class = $element
				.attr('class').split(' ')[0];

			var blueprints = generate.read(element_class);

			var value = blueprints.element.parse($element);

			pull_put.ui.$.find(".__content")
				.html(blueprints.edit.text);

			

			if(typeof blueprints.edit.middleware !== "undefined") {
				blueprints.edit.middleware();
			}

			blueprints.edit.fill(value);

			pull_put.ui.add_action(preview_action);
			
			pull_put.ui.rebuild_element = function() {
				var value = blueprints.edit.parse();
				
				var $new_element = generate.build.element(
					element_class, value
				);

				pull_put.ui.element = $new_element;
			}
		},
		stop: function() {
			pull_put.ui.$.find(".__content").attr('state', 'preview');
			if(pull_put.is_pulled) {
				pull_put.ui.$.find(".__content")
					.html(pull_put.ui.element);
				pull_put.ui.add_action(edit_action);
			}
		},
		add_put_zone: function($element, _action) {
			pull_put.put_zone.add($element, function(event, $this, $pulled) {
				_action($this, $pulled);
				
				pull_put.reset();
				indicator.hide(1);
				if(typeof editor !== "undefined") {
					editor.check_self();
				}
			});
		},
		edit_action: edit_action,
		preview_action: preview_action
	}
	return exports;
})();

$(document).ready(function() {
	$(document).on('mousedown', '.medium-editor-action', function() {
		console.log('cll0');
		if(pull_put.ui.$.find(".__content").attr('state') == 'edit') {
			pull_put.ui.rebuild_element();		
		}
	});
	pull_put.ui.$.find(".__content").on(
		"keyup click change", 
		"button, input, .__value",
		function() {
			if(pull_put.ui.$.find(".__content").attr('state') == 'edit') {
				pull_put.ui.rebuild_element();		
			}
		}
	);
	$(document).on(
		"click",
		".m--button-delete",
		function() {
			if($(this).parent().hasClass('__item')) {
				// console.log("re")
				pull_put.ui.rebuild_element();
			}
		}
	)
});
