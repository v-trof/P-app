//getting django list to js

if(loads['request.session.notifications|safe']) {
  notification.deffered = JSON.parse(loads['request.session.notifications|safe']
  .replace(/(?:')/g, '"'));
}

$(document).ready(function() {
  if(notification.deffered && notification.deffered.length
     && notification.deffered instanceof Array) {
    notification.deffered.forEach(function(info) {
      if(! info.type) {
        info.type = 'success';
        info.message = info.text;
      }
      notification.show(info.type, info.message);
    });


  $.ajax({
    type: "POST",
    url: "/func/delete_notification/",
    data: {
      'csrfmiddlewaretoken': loads['csrf_token']
    }
  });
  }
});
