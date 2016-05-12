contact_template = '{% include "Pages/Account/profile/contacts/item/exports.html" %}';

$(document).ready(function() {
	$('#add_contact').addClass('--hidden');
	
	edit.start = function() {
		$('#add_contact').removeClass('--hidden');
		$('#contacts __item __value').attr('contenteditable', 'true');
	}

	edit.end = function() {
		$('#add_contact').addClass('--hidden');
		$('#contacts __item __value').attr('contenteditable', 'false');
	}

	$('#add_contact').click(function(e) {
		if(edit.editing) {
			popup.show('{% include "Pages/Account/profile/_popup_texts/new_contact/exports.html" %}',
			function() {
				popup.$.find(".__submit").click(function(e) {
					
					new_contact = $(contact_template);
					new_contact.find(".__type")
						.text(popup.$.find(".__contact-type").attr("folder"));
					new_contact.find(".__value")
						.text(popup.$.find(".__contact-value").val());
					 $.ajax({
			            type:"POST",
			            url:"/func/create_contact/",
			            data: {
			                   'contact_type': popup.$.find(".__contact-type").val(),
			                   'csrfmiddlewaretoken': '{{ csrf_token }}',
			                   'contact_info': popup.$.find(".__contact-value").()
			                  },
			            success: function(){
			                  notification.change('success','Контакт добавлен' );
			                               }
			            });
					$("#contacts").append(new_contact);
					popup.hide();
				});
			});
		}
	});
});