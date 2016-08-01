//students

results_display.replace_answer = function($answer,
	user_answer, right_answer, quality) {
	$answer.html('');
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

//results
$(document).ready(function() {
	if(typeof results_controls !== 'undefined') {

		console.log("reloc");

		results_display.replace_answer = function($answer,
			user_answer, right_answer, quality, index, worth) {

			var $result_tempalte = $('{% include "Elements/Modules/results_controls/__answer_display/exports.html" %}');

			$result_tempalte.find(".__student_answer")
				.addClass('--' + quality)
				.html(user_answer);

			if(quality === "positive") {
			 	$result_tempalte.find(".__right_answer").hide();

			} else {
				$result_tempalte.find(".__right_answer b")
					.html(right_answer);
			}

			var $stepper = $result_tempalte.find('.set_mark');

			results_controls.bind_stepper(
				$stepper,
				worth.answer,
				worth.max,
				function(mark) {
					results_controls.send_mark(index, mark, 
						worth.max, $result_tempalte)
				}
			)

			$answer.html($result_tempalte);
		}
	}
});
