
Array.prototype.has = function(value) {
	return (this.indexOf(value) > -1)
}

$(document).ready(function() {
	var results = {{results|safe}};
	var attempt = {{attempt|safe}};

	console.log(attempt);
	var summary_template = function(index, value, quality) {
		return '<div class="card --small sumfor_'
			+ index + ' row">'
			+'<button class="__number --flat --' + quality + '">' + index + '</button>'
			+'<div class="__value">'+value+'</div></div>';
	}

	panel.show("");

	answer_index = 0
	$(".preview .__task>.__content").each(function(task_index, el) {
		var use_full_format = false;

		var $answer_fileds = $(this).find(".__answer-field");

		if($answer_fileds.length > 1) {
			use_full_format = true;
		}

		$(this).find(".__answer-field").each(function(index, el) {
			var quality = "positive"
			var value = "Пусто"
			var $new_summary
			var index = index;

			if(use_full_format) {
				index = "" + (task_index+1) + "." + (index+1);
			} else {
				index = task_index+1;
			}

			if(results.forgiving.has(answer_index+1)) {
				quality = "neutral"
			} 
			if (results.missed.has(answer_index+1) ||
				results.mistakes.has(answer_index+1)) {
				quality = "negative"
			}

			if(attempt[answer_index].user_answer) {
				value = attempt[answer_index].user_answer;
			}

			$new_summary = $(summary_template(index, value, quality));
			panel.content.append($new_summary);

			$(this).html("");
			if(quality === "positive") {
				// $(this).html("Вы ответили верно:");
				$(this).append("<div>Ваш ответ: <b class='--positive'>" 
					+ value + "</b></div>");
			}

			if(quality === "neutral") {
				// $(this).html("Вы допустили помарку, но идея верная:");
				$(this).append("<div>Ваш ответ: <b class='--neutral'>" 
					+ value + "</b></div>");
				$(this).append("<div>Верный ответ: <b>" 
					+ attempt[answer_index].answer 
				+ "</b></div>");
			}

			if(quality === "negative") {
				// $(this).html("Вы ответили неверно:");
				$(this).append("<div>Ваш ответ: <b class='--negative'>" 
					+ value + "</b></div>");
				$(this).append("<div>Верный ответ: <b>" + 
						attempt[answer_index].answer + 
					"</b></div>");
			}

			scroll.wire($new_summary, $(this).parent().parent());
			answer_index+=1
		});	
	});
});