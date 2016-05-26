{% if request.user.id = user.id %}

function delete_contact($contact) {
	console.log($contact);
	console.log($contact.closest( ".__item" ).attr('id'));

	$.ajax({
		type:"POST",
		url:"/func/delete_contact/",
		data: {
			'contact_type': $contact.closest( ".__item" ).attr('id'),
			'csrfmiddlewaretoken': '{{ csrf_token }}',
		},
		success: function() {
			notification.show('success','Контакт удален' );
		}
	});
}


$(document).ready(function() {
	$("#contacts .__item").each(function(index, el) {
		console.log(el);
		button_delete.add($(this), function() {
			delete_contact($(el));
		});
	});
});

{% endif %}