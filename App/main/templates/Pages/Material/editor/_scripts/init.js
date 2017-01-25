editor.check.empty_text = 'Добавьте сюда элемент';

editor.fill_item_list(
  $('.item-list.m--question'), 'question'
);

test_manager.publish_popup = '{% include "Pages/Test/editor/_publish_popup/exports.html" %}'

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
  {% if material.share_data %}
    share_data: {{material.share_data|safe}},
  {% endif %}
  csrf_token: "{{ csrf_token }}",
  current_type: "{{type}}"
}
{% if test.json %}
  django.loaded = {{material.json|safe}};
{% endif %}
