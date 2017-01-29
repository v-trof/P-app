var False = false;
var True = true;
var None = false;

var django = {
  course: {
    id: "{{course.id}}"
  },
  material: {
    id: "{{material.id}}"
  },
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
