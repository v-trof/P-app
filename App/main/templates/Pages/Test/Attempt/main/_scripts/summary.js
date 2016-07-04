$(document).ready(function() {
	var summary_template = function(index,value="Пусто") {
		return '<div class="card --small sumfor_'
			+ index + ' row">'
			+'<div class="__number">' + index + ':</div>'
			+'<div class="__value">' + value + '</div></div>';
	}

	panel.show("");

	function show_value(field_index, value) {
		$(".sumfor_"+field_index).children(".__value").html(value);
		
		$.ajax({
			type:"POST",
			url:"../attempt/save/",
			data: {
			"question":field_index,
			"answer":value,
			"test_id":"{{test.id}}",
			"course_id":"{{course.id}}",
			"csrfmiddlewaretoken":"{{ csrf_token }}"
		},
			success: function() {
				notification.show('success', 'Ответ отправлен' );
			},
		});
	}
	test_json={{test.json|safe}};
	answer_it=0;
	$(".__answer-field").each(function(index, el) {
		console.log('11');
		while (test_json.tasks[index][answer_it].type != "answer")
		{
			answer_it+=1;
		}
		if (test_json.tasks[index][answer_it].value == "" || test_json.tasks[index][answer_it].value == null)
			var $new_summary = $(summary_template(index+1,"Пусто"));
		else var $new_summary = $(summary_template(index+1,test_json.tasks[index][answer_it].value));
		panel.content.append($new_summary);
		var element_class = $(this)
				.attr('class').split(' ')[0];

		var blueprints = generate.read(element_class);

		// console.log(blueprints, element_class);

		blueprints.element.getter($(this), function(value) {
			show_value(index+1, value);
		});

		scroll.wire($new_summary, $(this).parents(".card"));
	});	
});