var False = false;
var True = true;
var None = false;

editor.check.empty_text = 'Добавьте сюда элемент вопроса';

editor.fill_item_list(
  $('.item-list.m--question'), 'question'
);

editor.fill_item_list(
  $('.item-list.m--answer'), 'answer'
);


test_manager.publish_popup = '{% include "Pages/Test/editor/_publish_popup/exports.html" %}'

var django = {
  course: {
    id: "{{course.id}}"
  },
  test: {
    id: "{{test.id}}"
  },
  {% if test.share_data %}
    share_data: {{test.share_data|safe}},
  {% endif %}
  csrf_token: "{{ csrf_token }}",
  current_type: "{{type}}"
}
{% if test.json %}
  django.loaded = {{test.json|safe}};
{% endif %}

$(document).ready(function() {
  if(defined(django.loaded)) {
    test_manager.load(django.loaded);
  }
});
