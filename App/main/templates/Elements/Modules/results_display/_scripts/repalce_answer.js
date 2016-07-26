results_display.replace_answer = function($answer,
	user_answer, right_answer, quality) {
	$answer.html("");
	if(quality === "positive") {
		$answer.append("<div>Ваш ответ: <b class='--positive'>" 
			+ user_answer + "</b></div>");
	}

	if(quality === "neutral") {
		$answer.append("<div>Ваш ответ: <b class='--neutral'>" 
			+ user_answer + "</b></div>");
		$answer.append("<div>Верный ответ: <b>" 
			+ right_answer
		+ "</b></div>");
	}

	if(quality === "negative") {
		$answer.append("<div>Ваш ответ: <b class='--negative'>" 
			+ user_answer + "</b></div>");
		$answer.append("<div>Верный ответ: <b>" + 
				right_answer + 
			"</b></div>");
	}
}