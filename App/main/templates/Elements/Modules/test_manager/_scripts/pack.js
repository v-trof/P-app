test_manager.pack = function() {
	var test_json = []
	$(".preview .__task").each(function(index, el) {
		var task_index = index;

		test_json[task_index] = {
			answer_items: [],
			question_items: []
		}

		$(this).find(".__answer").children().each(function(index, $element) {
			var element_class = $(this)
				.attr('class').split(' ')[0];

			test_json[task_index].answer_items.push(generate.read(element_class)
				.element.parse($(this)));
		});

		$(this).find(".__question").children().each(function(index, $element) {
			var element_class = $(this)
				.attr('class').split(' ')[0];

			test_json[task_index].question_items.push(generate.read(element_class)
				.element.parse($(this)));
		});

	});
	return JSON.stringify(test_json);
}