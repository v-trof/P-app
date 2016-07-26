var results_display = {
	init: function(test_info, attempt_info, result_info) {
		if(test_info) {
			test_manager.load.test(test_info);
		}
		results_display.create_summary(attempt_info, result_info);
	}
}