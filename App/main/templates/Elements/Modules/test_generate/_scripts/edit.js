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

			blueprints.edit.fill(value);

			pull_put.ui.add_action(preview_action);
			
			pull_put.ui.$.on("keydown change blur",".__content input", 
				function() {
					var value = blueprints.edit.parse();
					
					var $new_element = generate.build.element(
						element_class, value
					);

					pull_put.ui.element.html($new_element);
				})

			generate.edit.is_on = true;
		},
		stop: function() {
			if(pull_put.is_pulled) {
				var $element = pull_put.ui.element;
					
				var element_class = $element
						.attr('class').split(' ')[0];

				var blueprints = generate.read(element_class);

				var value = blueprints.edit.parse();

				console.log(value);

				var $new_element =  generate.build.element(element_class, value);

				pull_put.ui.element.html($new_element);

				pull_put.ui.$.find(".__content")
					.html(pull_put.ui.element);

				pull_put.ui.add_action(edit_action);
				generate.edit.is_on = false;
			}
		},
		edit_action: edit_action,
		preview_action: preview_action
	}
	return exports;
})();