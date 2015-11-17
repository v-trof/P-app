//sample
var mark_descriptions = {
	kursA: {
		m4: {
			type : "Тест",
			name : "a",
			percentage : 1,
			done : 156,
			total : 10000,
			date : "18.10.2015"
		},
		m5: {
			type : "Тест",
			name : "Палеоназмы",
			percentage : 74,
			done : 14,
			total : 19,
			date : "12.10.2015"
		}
	}
}
//realcode
function get_description(mark){
	console.log(mark_descriptions);
	mark = mark.split("_");
	console.log(mark_descriptions[mark[1]][mark[2]]);
	return mark_descriptions[mark[1]][mark[2]];
}

$(document).ready(function() {
	$(".card-marks__marks>button").blur(function() {
		$(".marks__tooltip").css({
				top: "-100%",
				left: "-100%",
				opacity: 0
			});
			$(this).removeClass('open');
	});
	$(".card-marks__marks>button").focus(function() {
		$(".card-marks__marks>button").removeClass('open');
		var left = $(this).offset().left + $(this).outerWidth()/2;
		var top = $(this).offset().top + $(this).outerWidth();
		var description = get_description($(this).attr("id"));
		console.log(description,left,top);
		$(".tooltip__heading").text(description.type + " «"+description.name+ "»");
		$(".tooltip__results").html(description.percentage + "%<span>("+description.done + " из " + description.total + ")</span>");
		$(".tooltip__date").text(humanize.date(description.date));
		$(".marks__tooltip").css({
			top: top+'px',
			left: left-$(".marks__tooltip").outerWidth()/2+'px',
			opacity: 1
		});
		$(this).addClass('open');
	});
});