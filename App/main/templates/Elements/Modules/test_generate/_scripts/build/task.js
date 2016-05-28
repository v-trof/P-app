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
