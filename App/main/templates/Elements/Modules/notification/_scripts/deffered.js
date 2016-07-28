{% for notification in notifications %}
  {% if notification.type %}
    notification.show('{{notification.type}}', '{{notification.text}}');
  {% else %}
    notification.show('success', '{{notification.text}}');
  {% endif %}
{% endfor %}
