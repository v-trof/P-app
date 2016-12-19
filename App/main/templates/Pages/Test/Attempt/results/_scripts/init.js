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
django.results = {{results|safe}};

$(document).ready(function() {
  if(defined(django.loaded)) {
    results_display.init(django.loaded, django.attempt, django.results);

    var $redo = $('<button>Попросить переписать</button>');
    console.log(django.test.id)
    $redo.click(function() {
      $.ajax({
        url: '/test/request_reset/',
        type: 'POST',
        data: {
          'course_id': django.course.id,
          'test_id': django.test.id,
          'csrfmiddlewaretoken': django.csrf_token
        }
      }).success(function(response) {
         if(response && response["type"]) {
             notification.show(response["type"], response["message"]);
         } else {
           notification.show('success',
                        'Запрос преподавателю на сброс результатов отправлен');
         }
      }).error(function(error) {
        notification.show('error', "Произошла ошибка");
      });
    });

    $('.preview').append($redo);
  } else {
    $('.preview>h2').html('Ошибка при загрузке теста');
    //GET-AJAX-HERE error log
  }

  adapt_layout();
});
