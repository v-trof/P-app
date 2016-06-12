generate.build.element = function(element_class, value, addtitional) {
	var blueprint = generate.read(element_class).element

	var $element = blueprint.build(value)

	if(addtitional) {
		blueprint.boundaries = blueprint.boundaries
								.concat(addtitional.boundaries);
	}

	blueprint.boundaries.forEach(function(boundary_name) {
		boundary_name($element)
	});

	{% if not attempt %}
		$element.attr('answer', value.answer)
	{% endif %}
	
	return $element;
}
{% if not attempt %}
generate.let_editing = function($element) {
	pull_put.puller.add($element,
		["add", "delete"],
		generate.edit.edit_action,
		undefined,
		false,
		true);

	generate.edit.add_puller($element, function($this, $pulled) {
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