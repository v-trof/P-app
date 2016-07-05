
Array.prototype.has = function(value) {
	return (this.indexOf(value) > -1)
}

$(document).ready(function() {
	var results = {{results|safe}};
	var attempt = {{attempt|safe}};

	var summary_template = function(index, value, quality) {
		return '<div class="card --small sumfor_'
			+ index + ' row">'
			+'<button class="__number --flat --' + quality + '">' + index + '</button>'
			+'<div class="__value">'+value+'</div></div>';
	}

	panel.show("");

	answer_index = 0
	$(".preview .__task>.__content").each(function(task_index, el) {
		$(this).find(".__answer-field").each(function(i, el) {
			var quality = "positive"
			var value = "Пусто"
			var $new_summary

			answer_index+=1
			if(results.forgiving.has(answer_index)) {
				quality = "neutral"
			} 
			if (results.missed.has(answer_index) ||
				results.mistakes.has(answer_index)) {
				quality = "negative"
			}

			if(attempt["tasks"][task_index].user_answer) {
				value =attempt["tasks"][task_index].user_answer;
			}

			$new_summary = $(summary_template(answer_index, value, quality));
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
					+ attempt["tasks"][task_index].answer 
				+ "</b></div>");
			}

			if(quality === "negative") {
				// $(this).html("Вы ответили неверно:");
				$(this).append("<div>Ваш ответ: <b class='--negative'>" 
					+ value + "</b></div>");
				$(this).append("<div>Верный ответ: <b>" + 
						attempt["tasks"][task_index].answer + 
					"</b></div>");
			}

			scroll.wire($new_summary, $(this).parent().parent());
		});	
	});
	
});