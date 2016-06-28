contact_template = '{% include "Pages/Account/profile/contacts/item/exports.html" %}';

$(document).ready(function() {

	$('#add_contact').click(function(e) {
		popup.show('{% include "Pages/Account/profile/_popup_texts/new_contact/exports.html" %}',
		function() {
			popup.$.find(".__submit").click(function(e) {
				$new_contact = $(contact_template);
				$new_contact.find(".__type")
					.text(popup.$.find(".__contact-type").val());

				$new_contact.find(".__value")
					.text(popup.$.find(".__contact-value").val());

				$.ajax({
			        type:"POST",
			        url:"/func/create_contact/",
			        data: {
			          'contact_type': popup.$.find(".__contact-type").val(),
			          'csrfmiddlewaretoken': '{{ csrf_token }}',
			          'contact_info': popup.$.find(".__contact-value").val()
			            },
			        success: function() {
			                  notification.show('success','Контакт добавлен' );
			                               }
			            });
					$("#contacts").append($new_contact);
					popup.hide();

					location.reload();
				});
			});
		});
	});