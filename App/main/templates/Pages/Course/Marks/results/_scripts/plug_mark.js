function plug_marks_init($group) {
	$group.on('click', '.card.m--user button', function(event) {
		var changed=false;

		$('.m--active').removeClass('m--active');
		$(this).parent().parent().addClass('m--active');

		var student_id = $(this)
      .parent().parent().attr('id');

		if(student_id != results_controls.active_student) {
			results_controls.active_student = student_id;
			changed=true;
		}

    //TEST
		var id = $(this).attr('id');

		if(results_controls.active_test != id) {
  		results_controls.active_test = id;
  		changed=true;
    }
		
		if(changed) {
			results_controls.load();
		}
	});
}
