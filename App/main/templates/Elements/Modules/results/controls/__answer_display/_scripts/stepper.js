results_controls.bind_stepper = function(
  $element,
  current_value,
  max_value,
  _call_back) {
  var $inc = $element.find('.inc_mark');
  var $dec = $element.find('.dec_mark');
  var $current = $element.find('.__current');

  //display
  $element.find('.__max').text(max_value);
  $current.text(current_value);

  $inc.click(function(event) {
    if(current_value < max_value) {
      current_value++;
      $current.text(current_value);
      _call_back(current_value);
    }
  });

  $dec.click(function(event) {
    if(current_value > 0) {
      current_value--;
      $current.text(current_value);
      _call_back(current_value);
    }
  });
}

$(document).ready(function() {
  results_display.answer_decorator = function($answer, attempt_data, index) {
    var $stepper = $(
                      loads.get('Elements/Modules/Results/controls/__set_mark/')
                    );
    var $icon = $answer.find('.__icon');
    var $index =
    $answer.find('.__score').replaceWith($stepper);
    results_controls.bind_stepper($stepper,
                                  attempt_data.user_score, attempt_data.worth,
                                  function(score) {
                                    results_controls.send_mark(index,
                                      score, attempt_data.worth, $icon);
                                  });
  }
});
