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
			
			pull_put.ui.$.on(
				"keydown change blur click", 
				".__content input, .__content .__value button",
				function() {
					var value = blueprints.edit.parse();
					
					var $new_element = generate.build.element(
						element_class, value
					);

					pull_put.ui.element = $new_element;
			});
		},
		stop: function() {
			if(pull_put.is_pulled) {
				var $element = pull_put.ui.element;
					
				var element_class = $element
						.attr('class').split(' ')[0];

				var blueprints = generate.read(element_class);

				var value = blueprints.edit.parse();

				var $new_element =  generate.build.element(element_class, value);

				pull_put.ui.element = $new_element;

				pull_put.ui.$.find(".__content")
					.html(pull_put.ui.element);

				pull_put.ui.add_action(edit_action);
			}
		},
		add_puller: function($element, _action) {
			pull_put.put_zone.add($element, function(event, $this, $pulled) {
				if ($pulled.hasClass('__answer-field')) {
					var element_type = "answer";
				} else {
					var element_type = "question";
				}

				if(element_type == $element.parent().attr("class").substring(2)) {
					{% if not attempt %}
						generate.let_editing($pulled);
					{% endif %}

					_action($this, $pulled);
					
					pull_put.reset();

					if(editor){
						editor.check_self();
					}
				}
			});
		},
		edit_action: edit_action,
		preview_action: preview_action
	}
	return exports;
})();