$(document).ready(function() {
	$(".group").each(function(index, el) {
		accordion.add($(this), "h3");
	});
});