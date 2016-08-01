$(document).ready(function() {
	$(".card.--user button").click(function(event) {
		$('.--active').removeClass('--active');
		$(this).parent().parent().addClass('--active');
		results_controls.active_student = $(this)
      .parent().parent().attr('id');
		{% if not test_id %}
			results_controls.active_test = $(this).attr('id');
		{% endif %}
		results_controls.load();
	});
});
