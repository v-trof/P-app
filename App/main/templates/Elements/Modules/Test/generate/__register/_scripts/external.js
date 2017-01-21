generate.register.external = function(type, subtype, external_data) {
  if (!(type && subtype)) return false;

  var data = this.bind_data(type, subtype, 'external', external_data);

  //creating observe shortcut for summary and send
  data.external.observe = function($element, element_data, _check) {

    if( ! defined(_check)) return false;
    data.external.observer($element, function() {
      var value = data.external.get_value($element);
      var summary = data.external.get_summary(value, element_data);
      _check(value, summary);
    });
  }

  data.external.make_answer = function(user_answer, right_answer,
                                       user_score, worth, result,
                                       element_data) {

    var answers = data.external.to_answer(user_answer, right_answer,
                                          element_data);

    if( ! user_answer) {
      answers.user = $("<b> Пропущено </b>");
    }
    var $new_answer = $(loads.get("Elements/Modules/Test/generate/" +
                                  "data/external/answer/__template/"));
    var $score = $new_answer.find('.__score');

    $new_answer.find('.__user>.__answer').html(answers.user);

    $score.find('.__current').html(user_score);
    $score.find('.__max').html(worth);


    summary.set_icon(result, $new_answer.find('.__data>.__icon'));

    if(data.element.never_check) {
      $new_answer.find('.__right').remove();
    } else {
      $new_answer.find('.__right>.__answer').html(answers.right);
      setTimeout(function() {
        accordion.add($new_answer.find('.__right'), 'h3');
        var $accordion_toggle = $new_answer.find('.m--accordion-toggle');
        $accordion_toggle.css({
          "left": $accordion_toggle[0].offsetLeft,
          "right": "auto"
        });

        $accordion_toggle.click();
      }, 100);
    }

    return $new_answer;
  }

  data.external.make_answer_edit = function(user_answer, right_answer,
                                       user_score, worth, result) {
    //TODO

  }

  return true;
}
