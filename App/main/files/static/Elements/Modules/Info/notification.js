var notification = (function() {
  var template = {
    notification: '<div class="notification m--hidden"><div class="__icon"></div><div class="__text"></div></div>',
    icon: {
      error: loads['Elements/Icons/cancel.svg'],
      warning: loads['Elements/Icons/warning.svg'],
      success: loads['Elements/Icons/done.svg'],
      info: loads['Elements/Icons/info.svg']
    }
  }

  function build(type, content) {
    var $new_notification = $(template.notification);
    $new_notification.addClass('m--' + type);

    $new_notification.find('.__icon').html(template.icon[type]);
    $new_notification.find('.__text').html(content);

    return $new_notification;
  }

  function reposition() {
    $('.notification').each(function(index, el) {
      $(this).css('transform', 'translateY(' + index * 3.5 + 'rem)');
    });
  }

  var exports = {
    show: function(type, content) {
      var $new_notification = build(type, content);
      $('body').append($new_notification);
      setTimeout(function() {
        $new_notification.removeClass('m--hidden');
      }, 10)

      $new_notification.click(function() {
        notification.hide($new_notification);
      });

      reposition();

      setTimeout(function() {
        notification.hide($new_notification);
      }, 10000)
    },

    hide: function($notification) {
      $notification.addClass('m--hidden');
      setTimeout(function() {
        $notification.remove();
        reposition();
      }, 150)
    }
  }
  return exports;
})();

// {% for notification in request.session.notifications %}
//
//   {% if notification.type %}
//     notification.show(
//       '{{notification.type}}',
//       '{{notification.message}}'
//     );
//
//   {% else %}
//     notification.show('success', '{{notification.text}}');
//   {% endif %}
//
//   $.ajax({
//     type: "POST",
//     url: "/func/delete_notification/",
//     data: {
//       'csrfmiddlewaretoken': '{{ csrf_token }}'
//     }
//   });
// {% endfor %}
