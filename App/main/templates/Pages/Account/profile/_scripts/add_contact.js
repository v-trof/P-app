contact_template = '{% include "Pages/Account/profile/contacts/item/exports.html" %}';

$(document).ready(function() {
  $('#add_contact').click(function(e) {
    popup.show('{% include "Pages/Account/profile/_popup_texts/new_contact/exports.html" %}',
    function() {
      popup.$.find(".__submit").click(function(e) {
        var err = false;
        var type = popup.$.find(".__contact-type").val();
        var value = popup.$.find(".__contact-value").val();

        var $new_contact = $(contact_template);
        $new_contact.find(".__type").text(type);
        $new_contact.find(".__value").text(value);

        console.log(type, ':', value);
        if(value.length === 0) {
          notification.show('warning', "Введите контактную информацию");
          err = true;
        }

        if(type.length === 0) {
          notification.show('warning', "Выберите тип контакта");
          err = true;
        }

        if(err) return;
        $.ajax({
          type: "POST",
          url: "/func/create_contact/",
          data: {
            'contact_type': type,
            'csrfmiddlewaretoken': '{{ csrf_token }}',
            'contact_info': value
          },
          success: function(response) {
            if(response && response["type"]) {
              notification.show(response["type"], response["message"]);
            }  else {
              notification.show('success','Контакт добавлен' );
            }
            location.reload();
          }
        });
        $("#contacts").append($new_contact);
        popup.hide();
        });
      });
    });
  });
