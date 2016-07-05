
Array.prototype.has = function(value) {
	return (this.indexOf(value) > -1)
}

$(document).ready(function() {
	var results = {{results|safe}};
	// var attempt = {{test|safe}};

	var summary_template = function(index, value, quality) {
		return '<div class="card --small sumfor_'
			+ index + ' row">'
			+'<button class="__number --flat --' + quality + '">' + index + '</button>'
			+'<div class="__value">'+value+'</div></div>';
	}

	panel.show("");

	console.log(results)
	$(".__answer-field").each(function(index, el) {

		index+=1
		var quality = "positive"
		var value = "Пусто"

		if(results.forgiving.has(index)) {
			quality = "neutral"
		} 
		if (results.missed.has(index) || results.mistakes.has(index)) {
			quality = "negative"
		}

		// if(test_json.tasks[index][answer_it].value) {
		// 	value = test_json.tasks[index][answer_it].value;
		// }

		panel.content.append(summary_template(index, value, quality));

		$(this).html("<div>"+"value"+"</div>");

	});	
});