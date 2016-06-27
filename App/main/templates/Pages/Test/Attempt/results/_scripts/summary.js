$(document).ready(function() {
	var summary_template = function(index, value) {
		return '<div class="card --small sumfor_'
			+ index + ' row">'
			+'<button class="__number --'+mark.quality+'">' + index + ':</button>'
			+'<div class="__value">'+value+'</div></div>';
	}

	panel.show("");

	forgiving = {{attempt|safe}}.forgiving;
	mark = {{attempt|safe}}.mark;
	panel.actions.html("Оценка: <b class='--"+mark.quality+"' style='margin-left:0.325rem'> " + mark.value +"</b>");

	var results = {{attempt|safe}}.tasks;
	console.log(results);
	$(".__answer-field").each(function(index, el) {
		value = results["0"].user_answer;



		panel.content.append(summary_template(index+1, value));

		
		if (value == results["0"].answer) {
			$(this).html("<div class='__user-answer'><b class='--positive'>"
				+value+"</b></div>");
		}
		else if (mark.value>3) {
			$(this).html("<div class='__user-answer'><b class='--positive'>"
				+value+"</b></div><div>Верный ответ: "
				+ results["0"].answer + "</div>");
		} else {
			$(this).html("<div class='__user-answer'><b class='--negative'>"
				+value+"</b></div><div>Верный ответ: "
				+ results["0"].answer + "</div>");
		}

	});	
});