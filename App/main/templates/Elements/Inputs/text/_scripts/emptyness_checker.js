function check_if_filled($input) {
	if(
		$input.val().length || 
		($input.text().length)
	) {
		$input.siblings('label').addClass('m--top')
	} else {
		$input.siblings('label').removeClass('m--top')
	}
}

$(document).ready(function() {
	$("body").on(
		"keydown change blur", ".m--text>.__value", function() {
		 check_if_filled($(this));
	});
	$("input").each(function(index, el) {
		 check_if_filled($(this))
	});
});
