{% if request.user.id == course.creator %}
function create_announcement(due_date,
  heading, text, id) {
  console.log(due_date);
  var $new_announcement = $('{% include "Elements/card/announcement/exports.html" %}');

  $new_announcement.attr('due-date', due_date);
  $new_announcement.attr("id", id);
  $new_announcement.find(".__heading").html(heading);
  $new_announcement.find(".__content").html(text);

  $new_announcement.find('.card__due-date strong').text(due_date);

  button_delete.add($new_announcement, function() {
    announcement_delete(id);
  });

  return $new_announcement;
}

$(document).ready(function() {
  $("#add_announcement").click(function() {
    popup.show('{% include "Pages/Course/main/_popup_texts/add_announcement/exports.html" %}');
      inline_editor.start($('.announcement_text')[0]);
       var today = new Date();

      $('.__due-date input').pickmeup({
        format: 'd-m-Y',
        min: today
      })

    $("#add_el").click(function(event) {
      var new_heading = $('[name="heading"]').val();
      var new_due_date  = $("#due_date").val();
      var new_text = $('.announcement_text').html();
      
      console.log(new_due_date);

      $.ajax({
        type:"POST",
        url:"/func/add_announcement/",
        data: {
          'csrfmiddlewaretoken': '{{ csrf_token }}',
          'text': new_text,
          'heading': new_heading,
          'course_id': "{{course.id}}",
          'due_date': new_due_date
        },
         success: function(response) {
            if(response && response["type"]) {
              notification.show(response["type"], response["message"]);
            } else {
              notification.show('success','Объявление добавлено');
            }
          popup.hide();
          if($(".announcements .card").length === 0) {
            $(".announcements").html($(".announcements h3"));
          }

          var $new_announcement = create_announcement(new_due_date,
           new_heading, new_text, response);

          $(".no_announcements").hide();
          $(".announcements").show();
          
          $(".announcements").append($new_announcement);
        },
        error: function() {
          notification.show('error','Произошла ошибка');            
        }
      });
    });
  });
});

{% endif %}
