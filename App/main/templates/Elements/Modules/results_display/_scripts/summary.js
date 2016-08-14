Array.prototype.has = function(value) {
	return (this.indexOf(value) > -1)
}


results_display.replace_json_value = function(element_class, value) {
	if(element_class === 'answer--classify') {
		return "(Вопрос)Классификация"
	}
}

results_display.summary_template = function(index, value, quality, element_class) {
	if(typeof value == 'object') {
		value = results_display.replace_json_value(element_class, value);
	}

	return '<div class="card m--small sumfor_'
		+ index + ' row">'
		+'<button class="__number m--flat m--' + quality + '">' 
		+ index + '</button>'
		+'<div class="__value">'+value+'</div></div>';
}

results_display.create_summary = function(attempt, results) {
	panel.show("");
	answer_index = 0;

	// console.log(attempt);
	//loop through tasks
	$(".preview .__task>.__content").each(function(task_index, el) {
		var use_full_format = false;

		//set number
		$(this).siblings('.__number').text(task_index+1);
		
		var $answer_fileds = $(this).find(".__answer-field");


		//if 2 answers per task
		if($answer_fileds.length > 1) {
			use_full_format = true;
		}

		//loop through answer_fileds
		$answer_fileds.each(function(index, el) {
			var quality = "positive"
			var value = "Пусто"
			var $new_summary
			var index = index;

			var element_class = this.classList[0];
			//for better visualization
			if(use_full_format) {
				index = "" + (task_index+1) + "." + (index+1);
			} else {
				index = task_index+1;
			}
			

			//check if not right
			if(results.forgiving.has(answer_index)) {
				quality = "neutral"
			}

			if (results.missed.has(answer_index) ||
				results.mistakes.has(answer_index)) {
				quality = "negative"
			}

			//check user answered
			if(attempt[answer_index].user_answer) {
				value = attempt[answer_index].user_answer;
			}

			$new_summary = $(results_display.
				summary_template(index, value, quality, element_class));
			panel.content.append($new_summary);

			results_display.replace_answer(
				$(this), 
				value, attempt[answer_index].answer,
				quality,
				attempt[answer_index].time,
				element_class,
				answer_index,
				{
					answer: attempt[answer_index].user_score,
					max: attempt[answer_index].worth
				}
			)

			if(typeof results_controls === 'undefined') {
				scroll.wire($new_summary, $(this).parent().parent());
			} else {
				scroll.wire($new_summary, $(this), $('.preview'));
			}
			answer_index+=1
		});	
	});
}
