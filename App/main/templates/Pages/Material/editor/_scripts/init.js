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


test_manager.publish_popup = '{% include "Pages/Material/editor/_publish_popup/exports.html" %}'

var django = {
  course: {
    id: "{{course.id}}"
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
{% if material.json %}
  django.loaded = {{material.json|safe}};
{% endif %}
console.log(django.loaded)

$(document).ready(function() {
  if(defined(django.loaded)) {
    test_manager.load(django.loaded);
  }
});
