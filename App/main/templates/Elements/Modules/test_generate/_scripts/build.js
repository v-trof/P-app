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

	pull_put.put_zone.add($element, 
		function() {
			$element.after(pull_put.ui.element);
			generate.let_editing(pull_put.ui.element);
			// pull_put.puller.cancel();
		})

	return $element;
}
{% endif %}
generate.build.task = function($element) {
	generate.counter.tasks++

	var $new_task = $(generate.build.template.task)
	$(".preview .__content").append($new_task)
	
	{% if not attempt %}
		// add_boundary.block_empty(new_task.find(".--empty"))
		button_delete.add($new_task)
	{% endif %}

	$new_task.find(".__number").text(generate.counter.tasks);

	if ($element.hasClass('__answer-field')) {
		element_type = "answer";
	} else {
		element_type = "question";
	}

	{% if not attempt %}
		generate.let_editing($element);
	{% endif %}

	$new_task.find(".__" + element_type).html($element);

	$empty = $new_task.find(".--empty");

	pull_put.put_zone.add($empty, function(event, $this, $pulled) {
		$this.replaceWith($pulled);
		pull_put.ui.element = undefined;
	});
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