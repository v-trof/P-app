results_controls.check_load = function() {
  var test_id = results_controls.active_test;
  var user_id = results_controls.active_student;
  if( results_controls.loaded.tests[test_id + "-" + user_id]) {
    if(results_controls.loaded.results[test_id + "-" + user_id]) {
      return {
        test: true,
        results: true
      }
    } else {
      return {
        test: true,
        results: false
      }
    }
  }
  return {
    test: false,
    results: false
  }
}
