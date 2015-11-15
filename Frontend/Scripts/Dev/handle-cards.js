function homework_verify(){
	//...ajax
	$(".card-homework").each(function(index, el) {

		var total = $(this).children(".card-homework__task").length;
		var done = $(this).children(".done").length;
		console.log(total,done);
		if(total == done){
			$(this).addClass('done');
		} else {
			$(this).removeClass('done');
		}
	});
}

function set_traditional_listners(){
	$(".card-homework__task.traditional").click(function() {
		$(this).toggleClass('done');
		homework_verify();
	});
}

$(document).ready(function() {
	homework_verify();
	setInterval(function(){
		homework_verify();
	}, 1000);
	set_traditional_listners();
});
