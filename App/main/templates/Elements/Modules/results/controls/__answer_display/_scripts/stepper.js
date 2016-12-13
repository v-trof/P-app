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
    // console.log(current_value < max_value, current_value, max_value);
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
