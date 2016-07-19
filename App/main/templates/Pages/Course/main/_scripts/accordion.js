$(document).ready(function() {
	$(".assignments, .tests-materials>section").each(function(index, el) {
		accordion.add($(this), "h3");
	});
});