$(document).ready(function() {
	var summary_template = function(index, value) {
		return '<div class="card --small sumfor_'
			+ index + ' row">'
			+'<button class="__number">' + index + ':</button>'
			+'<div class="__value">'+value+'</div></div>';
	}

	panel.show("");

	$(".__answer-field").each(function(index, el) {
		// console.log({{attempt|safe}})
		panel.content.append(summary_template(index+1), "1");

		$(this).html("<div>"+"value"+"</div>");

	});	
});