test_manager.load = function(test_json) {

	$("h2").text(test_json.title);
	test_json.tasks.forEach(function(task_data) {
		console.log(task_data);
		var element_class = task_data[0].class;

		//building first element
		var $task = generate.build.task(
			generate.read(element_class)
			.element.build(task_data[0])
		);

		for (var i = 1; i < task_data.length; i++) {
			element_class = task_data[i].class;
			// console.log(task_data[i]);
			var $element =  generate.build.
								element(element_class, task_data[i])
			
			{% if attempt %}
				$element.find('.__value').attr('value', task_data[i].value);
			{% endif %}

			$task.find(".__content").append($element);
		}

		{% if not attempt %}
			editor.check_self();
		{% endif %}
	});
}

{% if test.json %}
$(document).ready(function() {
	test_manager.load({{test.json|safe}});
});
{% endif %}