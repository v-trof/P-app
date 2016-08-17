function check_if_filled($input) {
	var value;
	if($input[0].tagName==='INPUT') {
		console.log('text');
		value =  $input.val();
	} else {
		console.log($input);
		value =  $input.text();
	}
	console.log(value);
	if(value.length
		// $input.val().length || 
		// ($input.html().length)
	) {
		$input.siblings('label').addClass('m--top')
	} else {
		$input.siblings('label').removeClass('m--top')
	}
}

$(document).ready(function() {
	$("body").on(
		"keydown change blur", ".m--text>.__value", function() {
		 var $input = $(this);
		 setTimeout(function() {
		 	check_if_filled($input);
		 }, 10);
	});
	$("input").each(function(index, el) {
		 check_if_filled($(this))
	});
});
