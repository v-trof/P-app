function homework_verify(){
	//...ajax
	$(".card-homework").each(function(index, el) {
		var total = $(this).children(".card-homework__task").length;
		var done = $(this).children(".done").length;
		// console.log(total,done);
		if(total == done){
			$(this).addClass('done');
		}
	});
}

$(document).ready(function() {
	homework_verify();
	setInterval(function(){
		homework_verify();
	}, 1000);
});