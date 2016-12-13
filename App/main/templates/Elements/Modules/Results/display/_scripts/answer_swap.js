results_display.swap_answer = function(attempt_data, field_data, $answer_field) {
  var $answer = $(field_data.make_answer(attempt_data.user_answer,
                                         attempt_data.answer,
                                         attempt_data.user_score,
                                         attempt_data.worth,
                                         attempt_data.result,
                                         attempt_data));
  if(attempt_data.user_answer === attempt_data.answer) {
    $answer_field.replaceWith($answer);
  } else {
    $answer_field.replaceWith($answer);
  }
}
