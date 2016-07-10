function assignment_check_done($assignment) {
	var $checkboxes = $assignment.find(".--checkbox input");
	var $links = $assignment.find("a");
	
	// console.log($checkboxes, $links)
	//checking checkboxes
	all_checked = true
	$checkboxes.each(function(index, el) {
		if( ! $(this).is(":checked") ) {
			all_checked = false;
		}
	});
	//checking links
	all_finished = true
	$links.each(function(index, el) {
		if( ! $(this).hasClass('--done') ) {
			all_finished = false;
		}
	});

	// console.log(all_checked, all_finished);
	if(all_checked && all_finished) {
		var old_class = $assignment.attr('class');
		console.log(old_class, typeof old_class);
		$assignment.attr("o-class", old_class);

		$assignment.removeClass("--irrelevant");
		$assignment.removeClass("--urgent");

		$assignment.addClass("--done");
	} else {
		// console.log($assignment.attr("o-class"));

		if($assignment.attr("o-class")) {
			$assignment.attr("class", $assignment.attr("o-class"));
		}

		$assignment.removeClass('--done');
	}
}

$(document).ready(function() {
	$(".card.--assignment").each(function(index, el) {
		$assignment = $(this);
		$(this).on("click", ".--checkbox", function() {
			assignment_check_done($assignment);
		});

		assignment_check_done($assignment);
	});
});