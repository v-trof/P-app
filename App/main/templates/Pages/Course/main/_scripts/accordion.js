$(document).ready(function() {
	$(".main section:not(.linkbox)").each(function(index, el) {
		accordion.add($(this), "h3");
	});
});