var results_controls = {
  active_student: "",
  active_test: "",
  loaded: {
    tests: {},
    results: {}
  }
}
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

results_controls.display = function() {
  show_active_test(results_controls.active_test);
  var test_id = results_controls.active_test;
  var user_id = results_controls.active_student;

  var user_key = test_id + "-" + user_id;

  var test_info = results_controls.loaded.tests[user_key];

  var attempt_info = results_controls.loaded.results[user_key].attempt;
  var results_info = results_controls.loaded.results[user_key].mark;

  $('.preview>.__content').html('');
  results_display.init(test_info, attempt_info, results_info);

  var $redo = $('<button>Сбросить результаты</button>');

  $('.preview').append($redo);
  $redo.click(function() {
    $.ajax({
      url: '/test/reset_attempt/',
      type:'POST',
      data: {
        'course_id': django.course.id,
        'test_id': test_id,
        'user_id': user_id,
        'csrfmiddlewaretoken': django.csrf_token
      }
    }).success(function(response) {
       if(response && response["type"]) {
           notification.show(response["type"], response["message"]);
       } else {
         notification.show('success',
                           'Результаты сброшены, ученик может переписать');
       }
    }).error(function(error) {
      notification.show('error', "Произошла ошибка");
    });
  })
}

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
      loaded.results.test = true;
    console.log(json);
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
      loaded.results.mark = true;
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
      loaded.results.attempt = true;
      results_controls.loaded
        .results[test_id + "-" + user_id].attempt = json;
    });
  }

  check_load();
}

results_controls.change_score_view = function(
  index, mark, score, max, $icon) {
  var reset_class = function($element) {
    $element.removeClass('m--negative');
    $element.removeClass('m--neutral');
    $element.removeClass('m--positive');
  }

  var test_score = results_display.calculate_score();

  var $mark = $('[href$="/' + results_controls.active_student +'"]')
                .parent().find('button[test="' +
                  results_controls.active_test+'"]');
  var $summary_icon = $('.summary-item').eq(index).find('button');
  var $summary_mark = $('.summary-mark')

  reset_class($mark);
  reset_class($summary_mark);

  $mark.addClass('m--' + mark.quality)
    .text(mark.value);

  results_display.update_mark(mark, test_score);

  if(score === max) {
    summary.set_icon('right', $icon);
    summary.set_icon('right', $summary_icon);
  } else if(score > 0) {
    summary.set_icon('forgiving', $icon);
    summary.set_icon('forgiving', $summary_icon);
  } else {
    summary.set_icon('wrong', $icon);
    summary.set_icon('wrong', $summary_icon);
  }
}

results_controls.send_mark = function(index,
  mark, max, $icon) {
  summary.set_icon('spinner', $icon);
  $.ajax({
    url: '/test/change_score/',
    type: 'POST',
    data: {
      'csrfmiddlewaretoken': django.csrf_token,
      'course_id': django.course.id,
      'test_id': results_controls.active_test,
      'user_id': results_controls.active_student,
      'answer_id': index,
      'score': mark
    },
  })
  .success(function(new_mark) {
    results_controls.change_score_view(
      index,
      new_mark,
      mark,
      max,
      $icon
    );
  })
  .error(function(error) {
    notification.show('error', error);
  })
}


$(document).ready(function() {
  summary.add_icon('spinner',
                   loads["Elements/Icons/spinner.svg"],
                   'Сохраняем на сервере',
                   'm--neutral');
});

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
