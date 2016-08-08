{% if request.user.id == user.id %}

function delete_contact($contact) {
	$.ajax({
		type:"POST",
		url:"/func/delete_contact/",
		data: {
			'contact_type': $contact.closest( ".__item" ).attr('id'),
			'csrfmiddlewaretoken': '{{ csrf_token }}',
		},
		success: function(response) {
			if(response && response["type"]) {
    		notification.show(response["type"], response["message"]);
    	}	else {
				notification.show('success','Контакт удален' );
			}
		}
	});
}


$(document).ready(function() {
	$("#contacts .__item").each(function(index, el) {
		button_delete.add($(this), function() {
			delete_contact($(el));
		});
	});
});

{% endif %}
