function assignment_check_done($assignment) {
	var $checkboxes = $assignment.find(".--checkbox input");
	var $links = $assignment.find("a");
	
	// console.log($checkboxes, $links)
	//checking checkboxes
	var all_checked = true
	$checkboxes.each(function(index, el) {
		console.log(this);
		if( ! $(this).is(":checked") ) {
			all_checked = false;
		}
	});
	//checking links
	var all_finished = true
	$links.each(function(index, el) {
		console.log(this);
		if( ! $(this).hasClass('--done') ) {
			all_finished = false;
		}
	});

	console.log(all_checked, all_finished);
	if(all_checked && all_finished) {
		$assignment.addClass("--done");
	} else {
		$assignment.removeClass('--done');
	}
}

$(document).ready(function() {
	$(".card.--assignment").each(function(index, el) {
		var $assignment = $(this);
		$(this).on("click", ".--checkbox", function() {
			assignment_check_done($assignment);
		});

		assignment_check_done($assignment);
	});
});
