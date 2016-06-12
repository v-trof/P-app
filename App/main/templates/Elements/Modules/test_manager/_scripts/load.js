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

		console.log($task);

		for (var i = 1; i < task_data.length; i++) {
			element_class = task_data[i].class;
			var $element =  generate.read(element_class)
				.element.build(task_data[i])

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
	console.log("{{test.json|safe}}");
});
{% endif %}