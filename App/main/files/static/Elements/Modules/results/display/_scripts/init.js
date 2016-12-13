results_display.init = function(test_info, attempt_info, results_info) {
  console.log(arguments);
  test_manager.load(test_info);
  summary.make(test_info, attempt_info, results_display.make_summary_item);
}
