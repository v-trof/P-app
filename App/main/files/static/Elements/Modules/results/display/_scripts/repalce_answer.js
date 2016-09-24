//students

results_display.parse_json_value = function(element_class,
 value, element_parsed) {
  var $element = $("<div class='json_answer'></div>");
  
  console.log(element_class);
  //classify
  if(element_class === 'answer--classify') {
    for(class_title in value) {
      var line = "<div class='row' style='flex-wrap: wrap'><div>"
       + class_title + ":</div>";
      value[class_title].forEach(function(item_text) {
        line += "<div class='card m--small'"
        + "style='margin-bottom: 0.375rem; margin-left: 0.375rem; font-weight: normal; padding-top: 0; padding-bottom: 0;'>"
         + item_text + "</div>"
      });
      line+='</div>';
      $element.append(line);
    }
    // console.log($element);
    return $element;
  } 

  //optons
  if(element_class === 'answer--radio' ||
     element_class === 'answer--checkbox') {
    value = value.slice();
    var values = element_parsed.values.slice();
    var is_big = false;
    // console.log("I", value, values);

    for(var i = 0; i<value.length; i++) {
      value[i] = values[value[i]];
      if(value[i].length > 20) {
        is_big = true;
      }
    }
    if(is_big) {
      value = value.join('<br><br>');
    } else {
      value = value.join(', ');
    } 
    return $('<div>' + value + '</div>');
  }

  //default
  if(value.join) {
    return $('<div>' + value.join(', ') + '</div>');
  }
};


results_display.replace_answer = function($answer,
      user_answer, right_answer, quality, time,
      element_class, index, worth) {

  var element_parsed = generate.data[element_class]
              .element.parse($answer);

  var current_el = $.extend(true, {}, element_parsed);

  if(typeof right_answer === 'object') {        
    right_answer = results_display.parse_json_value(element_class,
      right_answer, current_el).html();
  }

  if(typeof user_answer === 'object') {
    user_answer = results_display.parse_json_value(element_class,
      user_answer, current_el).html();
  }

  if(typeof right_answer === 'undefined') {
    right_answer = "Такие ответы проверяются учителем";
  }

  if(time) {
    var time = '<span class="m--grey m--time">' + time + '</span>';
  } else {
    time = '';
  }
  results_display.finish_answer($answer, user_answer, right_answer, 
    quality, time,element_class, index, worth); 
}

results_display.finish_answer = function($answer,
      user_answer, right_answer, quality, time,
      element_class, index, worth) {
  $answer.html('');
  if(quality === "positive") {
    $answer.append("<div>Ваш ответ: <b class='m--positive'>" 
      + user_answer + "</b>" + time + "</div>");
  }

  if(quality === "neutral") {
    $answer.append("<div>Ваш ответ: <b class='m--neutral'>" 
      + user_answer + "</b>" + time + "</div>");
    $answer.append("<div>Верный ответ: <b>" 
      + right_answer
    + "</b></div>");
  }

  if(quality === "negative") {
    $answer.append("<div>Ваш ответ: <b class='m--negative'>" 
      + user_answer + "</b>" + time + "</div>");
    $answer.append("<div>Верный ответ: <b>" + 
        right_answer + 
      "</b></div>");
  }
}

//results
$(document).ready(function() {
  if(typeof results_controls !== 'undefined') {

    results_display.finish_answer = function($answer,
      user_answer, right_answer, quality, time,
      element_class, index, worth) {
      // console.log('repl', user_answer, right_answer);
      var element_parsed = generate.data[element_class]
                  .element.parse($answer);

      var current_el = $.extend(true, {}, element_parsed);

      if(typeof right_answer === 'object') {        
        right_answer = results_display.parse_json_value(element_class,
          right_answer, current_el).html();
      }

      if(typeof user_answer === 'object') {
        user_answer = results_display.parse_json_value(element_class,
          user_answer, current_el).html();
      }

      var $result_tempalte = $('{% include "Elements/Modules/results_controls/__answer_display/exports.html" %}');
      if(time) {
        var time = '<span class="m--grey m--time">' + time + '</span>';
      } else {
        time = '';
      }

      $result_tempalte.find(".__student_answer")
        .addClass('m--' + quality)
        .html(user_answer + time);

      if(quality === "positive") {
         $result_tempalte.find(".__right_answer").hide();

      } else {
        $result_tempalte.find(".__right_answer b")
          .html(right_answer);
      }

      var $stepper = $result_tempalte.find('.set_mark');

      results_controls.bind_stepper(
        $stepper,
        worth.answer,
        worth.max,
        function(mark) {
          results_controls.send_mark(index, mark, 
            worth.max, $result_tempalte)
        }
      )

      /*  $result_tempalte.append('<div class="m--grey">'
         + time + '</div>');*/
      $answer.html($result_tempalte);
    }
  }
});
