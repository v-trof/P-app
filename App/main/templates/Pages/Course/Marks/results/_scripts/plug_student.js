$(document).ready(function() {
	$(".card.--user").click(function(event) {
		$('.card.--user.--active').removeClass('--active');
		$(this).addClass('--active');
		results_controls.active_student = $(this).attr('id');
		results_controls.load();
	});
});
