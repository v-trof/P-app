$(document).ready(function() {
	var summary_template = function(index, 
		show_index, value="Пусто") {
		return '<div class="card --small sumfor_'
			+ index + ' row">'
			+'<div class="__number">' + show_index + ':</div>'
			+'<div class="__value">' + value + '</div></div>';
	}

	panel.show("");
	panel.actions.hide();

	function show_value($summary, value, index) {
		$summary.children(".__value").html(value);
		$.ajax({
			type:"POST",
			url:"../attempt/save/",
			data: {
			"question":index,
			"answer":value,
			"test_id":"{{test.id}}",
			"course_id":"{{course.id}}",
			"csrfmiddlewaretoken":"{{ csrf_token }}"
		},
			error: function() {
				notification.show('error', 'Не удалось сохранить ответ на сервере, <br> не закрывайте тест' );
			},
		});
	}

	test_json={{test.json|safe}};

	$(".preview .__task>.__content").each(function(task_index, el) {
		var item_it = -1; //for no repeat later
		var use_full_format = false;

		var $answer_fileds = $(this).find(".__answer-field");

		if($answer_fileds.length > 1) {
			use_full_format = true;
		}

		$answer_fileds.each(function(index, el) {

			var value;
			var $new_summary;

			item_it+=1; //step after last found
			while (test_json.tasks[task_index][item_it].type !== "answer") {
				item_it+=1;
			}
			
			if(use_full_format) {
				show_index = "" + (task_index+1) + "." + (index+1);
			} else {
				show_index = task_index+1;
			}

			if (test_json.tasks[task_index][item_it].value) {
				value = test_json.tasks[task_index][item_it].value;
			} else {
				value = "Пусто";
			}

			index++;

			$new_summary = $(summary_template(index, show_index, value));

			panel.content.append($new_summary);

			var element_class = $(this)
					.attr('class').split(' ')[0];

			var blueprints = generate.read(element_class);

			blueprints.element.getter($(this), function(value) {
				show_value($new_summary, value, index);
			});

			scroll.wire($new_summary, $(this).parent().parent());
		});
	});	
});
