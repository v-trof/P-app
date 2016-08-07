function plug_marks_init($group) {
	$group.on('click', '.card.m--user button', function(event) {
		$('.m--active').removeClass('m--active');
		$(this).parent().parent().addClass('m--active');
		results_controls.active_student = $(this)
      .parent().parent().attr('id');

    //TEST
		var id = $(this).attr('id');
		results_controls.active_test = id;
		show_active_test(id);
		results_controls.load();
	});
}
