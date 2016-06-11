$(document).ready(function() {
	var summary_template = function(index) {
		return '<div class="card --small sumfor_'
			+ index + ' row">'
			+'<div class="__number">' + index + ':</div>'
			+'<div class="__value">Пусто</div></div>';
	}

	panel.show("");

	function show_value(field_index ,value) {
		$(".sumfor_"+field_index).children(".__value").html(value);
	}

	$(".__answer-field").each(function(index, el) {
		panel.content.append(summary_template(index+1));
		var element_class = $(this)
				.attr('class').split(' ')[0];

		var blueprints = generate.read(element_class);

		console.log(blueprints, element_class);

		blueprints.element.getter($(this), function(value) {
			show_value(index+1, value);
		});

	});	
});