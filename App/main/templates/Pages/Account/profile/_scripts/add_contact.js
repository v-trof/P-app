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
					popup.hide();
					
					new_contact = $(contact_template);
					new_contact.find(".__type")
						.text(popup.$.find(".__contact-type").val());
					new_contact.find(".__value")
						.text(popup.$.find(".__contact-value").val());

					$("#contacts").append(new_contact);
				});
			});
		}
	});
});