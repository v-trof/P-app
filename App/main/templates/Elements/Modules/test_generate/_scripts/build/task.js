generate.build.task = function($element) {
	var $new_task = $(generate.build.template.task)
	$('.preview>.__content').append($new_task)
	
	{% if not attempt and not read %}
		if(typeof prepend_margin === 'function') {
			$margin = prepend_margin($new_task);
		}

		var $bunch = $new_task.add($margin);

		console.log($bunch);

		button_delete.add($new_task, $bunch, function() {
			setTimeout(editor.check_self, 100);
			if(pull_put.is_pulled) {
				pull_put.reset();
			}
		})
	{% endif %}

	$new_task.find('.__content').append($element);

	{% if not attempt and not read %}
		generate.let_editing($element);
		editor.check_self();
	{% endif %}

	return $new_task;
}
