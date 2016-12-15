results_controls.load = function() {

  var loaded = {
    results: false
  }

  var test_id = results_controls.active_test;
  var user_id = results_controls.active_student;

  // console.log(results_controls);

  function check_load() {
    if(loaded.results.mark && loaded.results.attempt) {
      results_controls.display();
    } else {
      setTimeout(check_load, 20);
    }
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
    results_controls.loaded.tests[test_id + "-" + user_id] = {}

    $.ajax({
      url: '/test/get_test_info/',
      type: 'POST',
      data: {
        'csrfmiddlewaretoken': django.csrf_token,
        'course_id': django.course.id,
        'test_id': test_id,
        'user_id': user_id,
        'compiled': true
      },
    })
    .success(function(json) {
    //  loaded.results.test = true;
      results_controls.loaded.tests[test_id + "-" + user_id] = json;
    });

    // console.log(user_id);
    $.ajax({
      url: '/test/get_results/',
      type: 'POST',
      data: {
        'csrfmiddlewaretoken': django.csrf_token,
        'course_id': django.course.id,
        'test_id': test_id,
        'user_id': user_id
      },
    })
    .success(function(json) {
    //  loaded.results.mark = true;
      results_controls.loaded.results[test_id + "-" + user_id].mark = json;
    });

    // console.log(user_id);
    $.ajax({
      url: '/test/get_attempt_info/',
      type: 'POST',
      data: {
        'csrfmiddlewaretoken':  django.csrf_token,
        'course_id': django.course.id,
        'test_id': test_id,
        'user_id': user_id
      },
    })
    .success(function(json) {
    //  loaded.results.attempt = true;
      results_controls.loaded
        .results[test_id + "-" + user_id].attempt = json;
    });
  }

  check_load();
}
