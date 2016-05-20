function check_if_filled($input) {
	if(
		$input.val().length || 
		($input.text().length && $input.html() != "&nbsp;")
	) {
		// console.log($input.val())
		$input.siblings('label').addClass('--top')
	} else {
		$input.siblings('label').removeClass('--top')
	}
	if(!$input.text().length && $input.get(0).tagName == "div") {
		$input.html("&nbsp;")
	}
}

$(document).ready(function() {
	$("body").on(
		"keydown change blur", ".--text>.__value", function() {
		 check_if_filled($(this));
	});
	$("input").each(function(index, el) {
		 check_if_filled($(this))
	});
});