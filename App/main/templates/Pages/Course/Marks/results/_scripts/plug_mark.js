function plug_marks_init($group) {
	$group.on('click', '.card.--user button', function(event) {
		$('.--active').removeClass('--active');
		$(this).parent().parent().addClass('--active');
		results_controls.active_student = $(this)
      .parent().parent().attr('id');

    //TEST
		var id = $(this).attr('id');
		results_controls.active_test = id;
		show_active_test(id);
		results_controls.load();
	});
}
