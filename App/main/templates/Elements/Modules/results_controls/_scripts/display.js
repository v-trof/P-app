results_controls.display = function() {
	var test_id = results_controls.active_test;
	var user_id = results_controls.active_student;

	var user_key = test_id + "-" + user_id;
	
	var test_info = results_controls.loaded.tests[test_id];

	console.log(results_controls.loaded.results);
	var attempt_info = results_controls.loaded.results[user_key].mark;
	var results_info = results_controls.loaded.results[user_key].attempt;

	$('.preview>.__content').html('');
	test_manager.load.test(test_info);
	results_controls.set_numbers();


	test_manager.load.test(test_info);
}