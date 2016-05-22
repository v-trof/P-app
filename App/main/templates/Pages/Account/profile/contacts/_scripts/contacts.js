$(document).ready(function() {
	$("#contacts .__item").each(function(index, el) {
		button_delete.add($(this));
	});
	$(".--button-delete").click(function(e) {
			console.log($(this).closest( ".__item" ).attr('id'));
				$.ajax({
			        type:"POST",
			        url:"/func/delete_contact/",
			        data: {
			          'contact_type': $(this).closest( ".__item" ).attr('id'),
			          'csrfmiddlewaretoken': '{{ csrf_token }}',
			            },
			        success: function(){
			                  notification.show('success','Контакт удален' );
			                               }
			});
	});
});