function check_if_filled($input) {
	if($input.val().length || $input.text().length) {
		$input.siblings('label').addClass('--top')
	} else {
		$input.siblings('label').removeClass('--top')
	}
}

$(document).ready(function() {
	$("body").on("keydown chenge blur", ".--text>.__value", function(){
		 check_if_filled($(this));
	});
	$("input").each(function(index, el) {
		 check_if_filled($(this))
	});
});