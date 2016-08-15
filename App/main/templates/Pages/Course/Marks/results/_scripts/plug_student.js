$(document).ready(function() {
	$(".card.m--user").click(function(event) {
		$('.card.m--user.m--active').removeClass('m--active');
		$(this).addClass('m--active');

    if(results_controls.active_student != $(this).attr('id')) {
  		results_controls.active_student = $(this).attr('id');
  		results_controls.load();
    }
	});
});
