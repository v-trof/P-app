var False = false;
var True = true;

var django = {
  course: {
    id: "{{course.id}}"
  },
  test: {
    id: "{{test.id}}"
  },
  material: {
    id: "{{material.id}}"
  },
  csrf_token: "{{ csrf_token }}",
  current_type: "{{type}}"
}

{% if test.json %}
  django.loaded = {{test.json|safe}};
{% endif %}

django.attempt = {{attempt|safe}};
console.log(django.loaded)
$(document).ready(function() {
  function time_to_string(time) {
    var hhmmss = [Math.floor(time/3600), Math.floor((time%3600)/60), time%60];
    for(var i = 0; i < hhmmss.length; i++) {
      if(hhmmss[i]<10) hhmmss[i] = '0' + hhmmss[i];
    }

    return hhmmss.join(':');
  }

  if(defined(django.loaded)) {
    test_manager.load(django.loaded);
    attempt.append_send();
    summary.make(django.loaded, django.attempt, attempt.make_summary_item);

    if(django.loaded.time_left) {
      var time_s = django.loaded.time_left['{{user.id}}'];
      var time_a = time_s.split(':');
      var time_i = parseInt(time_a[2]) + parseInt(time_a[1]) * 60
      + parseInt(time_a[0]) * 3600;
      console.log(time_a, time_i);
      var timer = $('<div></div>');

      timer.text('Осталось: ' + time_s);

      setInterval(function() {
        time_i--;
        timer.text('Осталось: ' + time_to_string(time_i));
      }, 1000);
      panel.actions.show();
      panel.actions.html(timer);
    }


  } else {
    $('.preview>h2').html('Ошибка при загрузке теста');
    //GET-AJAX-HERE error log
  }

  adapt_layout();
});
