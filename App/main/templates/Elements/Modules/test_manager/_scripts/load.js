test_manager.load = {}

test_manager.load.test = function(test_json) {
	$("h2").text(test_json.title);
	test_json.tasks.forEach(function(material_data) {
		// console.log(material_data);
		var element_class = material_data[0].class;

		//building first element
		var $task = generate.build.task(
			generate.read(element_class)
			.element.build(material_data[0])
		);

		for (var i = 1; i < material_data.length; i++) {
			element_class = material_data[i].class;
			// console.log(material_data[i]);
			var $element =  generate.build.
								element(element_class, material_data[i])
			
			{% if attempt %}
				if (material_data[i].class == "answer--checkbox")
				{
					$(material_data[i].value).each(function( index ) {
						  $element.find("input[value='"+this+"']").attr('checked', true);
						});
				}
				else if (material_data[i].class == "answer--radio")
					$element.find("input[value='"+material_data[i].value+"']").attr('checked', true);
				else $element.find('.__value').attr('value', material_data[i].value);

			{% endif %}

			$task.find(".__content").append($element);
		}

		$(document).find(".answer--empty, .question--empty").remove();
		
		{% if not attempt and not read %}
			editor.check_self();
		{% endif %}
	});
}

test_manager.load.material = function(material_json) {
	$("h2").text(material_json.title);
	var material_data = material_json.tasks[0]
		// console.log(material_data);
	var element_class = material_data[0].class;

	$content = $(".preview>.__content>.card");

	for (var i = 0; i < material_data.length; i++) {
		element_class = material_data[i].class;
		// console.log(material_data[i]);
		var $element =  generate.build.
							element(element_class, material_data[i])

		$content.append($element);
	}
	{% if not attempt and not read %}
		editor.check_self();
	{% endif %}
}

{% if test.json %}
$(document).ready(function() {
	test_manager.load.test({{test.json|safe}});
});

{% elif material.json %}
$(document).ready(function() {
	console.log("a", {{material.json|safe}});
	test_manager.load.material({{material.json|safe}});
});
{% endif %}