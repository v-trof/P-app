generate.build.task = function($element) {
	var $new_task = $(generate.build.template.task)
	$(".preview .__content").append($new_task)
	
	{% if not attempt %}
		button_delete.add($new_task, $new_task, function() {
			editor.check_self();
		})
	{% endif %}

	if ($element.hasClass('__answer-field')) {
		element_type = "answer";
	} else {
		element_type = "question";
	}

	$new_task.find(".__" + element_type).html($element);

	{% if not attempt %}
		generate.let_editing($element);
		editor.check_self();
	{% endif %}
	
	return $new_task;
}
