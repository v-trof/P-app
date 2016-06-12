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
