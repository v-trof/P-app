results_controls.load = function() {

	var loaded = {
		test: false,
		results: false
	}

	var test_id = results_controls.active_test;
	var user_id = results_controls.active_student;

	function check_load() {
		if(loaded.test && loaded.results.mark && loaded.results.attempt) {
			results_controls.display();
		} else {
			setTimeout(check_load, 20);
		}
	}

	if(loaded.test) {
		test = results_controls.loaded.tests[test_id]
	} else {
		$.ajax({
			url: '/test/get_test_info/',
			type: 'POST',
			data: {
				'csrfmiddlewaretoken': '{{ csrf_token }}',
				'course_id': "{{course.id}}",
				'test_id': test_id,
			},
		})
		.success(function(test_json) {
			results_controls.loaded.tests[test_id] = JSON.parse(test_json);
			loaded.test = true;
		});
	}

	loaded.results = {
		attempt: false,
		mark: false
	}

	var results;

	if(loaded.results.mark) {
		results = results_controls.loaded.results[test_id + "-" + user_id]
		loaded.results = {
			attempt: true,
			mark: true
		}
	} else {
		results_controls.loaded.results[test_id + "-" + user_id] = {}

		$.ajax({
			url: '/test/get_results/',
			type: 'POST',
			data: {
				'csrfmiddlewaretoken': '{{ csrf_token }}',
				'course_id': "{{course.id}}",
				'test_id': test_id,
				'user_id': user_id
			},
		})
		.success(function(json) {
			loaded.results.mark = true;
			results_controls.loaded.results[test_id + "-" + user_id].mark = JSON.parse(json);
		});

		$.ajax({
			url: '/test/get_attempt_info/',
			type: 'POST',
			data: {
				'csrfmiddlewaretoken': '{{ csrf_token }}',
				'course_id': "{{course.id}}",
				'test_id': test_id,
				'user_id': user_id
			},
		})
		.success(function(json) {
			loaded.results.attempt = true;
			results_controls.loaded
				.results[test_id + "-" + user_id].attempt = JSON.parse(json);
		});
	}

	check_load();
}