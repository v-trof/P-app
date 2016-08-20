$("#invite_teacher").click(function(event) {
  popup.show('{% include "Pages/Course/groups/_popup_texts/invite_teacher/exports.html" %}');
  $(".teacher__email").focus();
  verifier.add($(".teacher__email"), "email");
  $("#invite_teacher_button").click(function(e) {
      var group=$(".m--select").children(".__display").text();
      if (group=="Выберите...")
        group="Нераспределенные";
      $.ajax({
        type:"POST",
        url:"/func/invite_teacher/",
        data: {
          'csrfmiddlewaretoken': '{{ csrf_token }}',
          'email':$(".teacher__email").val(),
          'course_id':"{{course.id}}",
          'group':group,
        },
         success: function(response) {
           if(response && response["type"]) {
            if(response.type == "success") {
              popup.hide();
            }
            notification.show(response["type"], response["message"]);
          } else {
            popup.hide();
            notification.show('success', 
              'Учитель приглашен, ждем от него подтверждение' );
          }
        },
    });
    });
});
