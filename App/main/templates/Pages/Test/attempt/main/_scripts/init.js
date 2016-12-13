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
  if(defined(django.loaded)) {
    test_manager.load(django.loaded);
    attempt.append_send();
    summary.make(django.loaded, django.attempt, attempt.make_summary_item);
  } else {
    $('.preview>h2').html('Ошибка при загрузке теста');
    //GET-AJAX-HERE error log
  }

  adapt_layout();
});
