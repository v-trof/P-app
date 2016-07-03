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
			$element.attr('answer', value.answer);
			if (typeof blueprint.fill === "undefined") {
				console.error("NOFILL", element_class);
			} else {
			blueprint.fill($element, value.answer);	
			}

		}
	{% endif %}

	return $element;
}
{% if not attempt %}
generate.let_editing = function($element) {
	pull_put.puller.add(
		$element,
		["add", "save", "delete"],
		generate.edit.edit_action,
		undefined,
		false,
		true);

	generate.edit.add_put_zone($element, function($this, $pulled) {
		$this.after($pulled);
	})

	return $element;
}
{% endif %}
generate.build.task = function($element) {
	var $new_task = $(generate.build.template.task)
	$(".preview>.__content").append($new_task)
	
	{% if not attempt %}
		button_delete.add($new_task, $new_task, function() {
			editor.check_self();
		})
	{% endif %}

	$new_task.find(".__content").append($element);

	{% if not attempt %}
		generate.let_editing($element);
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