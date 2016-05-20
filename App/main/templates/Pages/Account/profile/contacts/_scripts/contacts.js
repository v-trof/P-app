$(document).ready(function() {
	$("#contacts .__item").each(function(index, el) {
		if(index > 0) {
			button_delete.add($(this));
		}
	});
});