Array.prototype.has = function(value) {
	return (this.indexOf(value) > -1)
}

results_display.summary_template = function(index, value, quality) {
	return '<div class="card --small sumfor_'
		+ index + ' row">'
		+'<button class="__number --flat --' + quality + '">' 
		+ index + '</button>'
		+'<div class="__value">'+value+'</div></div>';
}

results_display.create_summary = function(attempt, results) {
	panel.show("");
	answer_index = 0;

	//loop through tasks
	$(".preview .__task>.__content").each(function(task_index, el) {
		var use_full_format = false;

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
				summary_template(index, value, quality));
			panel.content.append($new_summary);

			results_display.replace_answer(
				$(this), 
				value, attempt[answer_index].answer,
				quality,
				answer_index,
				{
					answer: attempt[answer_index].user_score,
					max: attempt[answer_index].worth
				}
			)

			scroll.wire($new_summary, $(this).parent().parent());
			answer_index+=1
		});	
	});
}
