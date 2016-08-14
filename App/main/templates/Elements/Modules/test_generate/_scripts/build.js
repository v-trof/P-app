generate.build.element = function(element_class, value, additional) {
	var blueprint = generate.read(element_class).element

	var $element = blueprint.build(value)

	if(additional) {
		blueprint.boundaries = blueprint.boundaries
								.concat(additional.boundaries);
	}

	blueprint.boundaries.forEach(function(boundary_name) {
		boundary_name($element)
	});
	{% if not attempt  %}
		if(value.answer) {
			if (typeof blueprint.fill === "undefined") {
				console.error("NOFILL", element_class);
			} else {
				blueprint.fill($element, value.answer);	
			}
			console.log(value.answer, typeof value.answer);
			if(typeof value.answer === 'object') {
				// console.log(value.answer);
				value.answer = JSON.stringify(value.answer);
			}
			$element.attr('answer', value.answer);
		}
	{% endif %}

	return $element;
}

{% if not attempt and not read %}
generate.let_editing = function($element) {
	// if(! $element.hasClass('m--pullable')) {
	pull_put.puller.add(
		$element,
		this.editing_actions,
		this.edit.edit_action,
		function() {
			indicator.show(1);
		},
		false,
		true);
	// }
	
	// if(! $element.hasClass('m--put-zone')) {
	indicator.add($element, 'down', 1);
	this.edit.add_put_zone($element, function($this, $pulled) {
		$this.after($pulled);
	});
	// generate.let_editing($pulled);
	// }

	return $element;
}
{% endif %}

generate.build.task = function($element) {
	var $new_task = $(generate.build.template.task)
	$('.preview>.__content').append($new_task)
	
	{% if not attempt and not read %}
		if(typeof prepend_margin === 'function') {
			$margin = prepend_margin($new_task);
		}

		var $bunch = $new_task.add($margin);

		// console.log($bunch);

		button_delete.add($new_task, $bunch, function() {
			setTimeout(editor.check_self, 100);
			if(pull_put.is_pulled) {
				pull_put.reset();
			}
		})
	{% endif %}

	$new_task.find('.__content').append($element);

	{% if not attempt and not read %}
		// generate.let_editing($element);
		editor.check_self();
	{% endif %}

	return $new_task;
}

generate.build.template = {
	question: function(element_class) {
		return "<div class='"+element_class+" __question-element'></div>"
	},
	answer: function(element_class) {
		return "<div class='"+element_class+" __answer-field'></div>"
	},
	task: '{% include "Elements/Modules/test_generate/__templates/__task/exports.html" %}'
}