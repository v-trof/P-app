test_manager.load = function(test_json) {
	$("h2").text(test_json.title);
	test_json.tasks.forEach(function(task_data) {
		var element_class = task_data.question_items[0].class;

		//building first element
		var $task = generate.build.task(
			generate.read(element_class)
			.element.build(task_data.question_items[0])
		);

		console.log($task);

		for (var i = 1; i < task_data.question_items.length; i++) {
			element_class = task_data.question_items[i].class;
			var $element =  generate.read(element_class)
				.element.build(task_data.question_items[i])

			$task.find(".__question").append($element);
		}

		$task.find(".__answer").html("");
		
		for (var i = 0; i < task_data.answer_items.length; i++) {
			element_class = task_data.answer_items[i].class;
			var $element =  generate.read(element_class)
				.element.build(task_data.answer_items[i]);

			$task.find(".__answer").append($element);
		}

	});
}

{% if test.json %}
$(document).ready(function() {
	test_manager.load({{test.json|safe}});
	console.log("{{test.json|safe}}");
});
{% endif %}