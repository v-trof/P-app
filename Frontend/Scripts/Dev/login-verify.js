function all_valid(){
	inputs_valid = true
	$("input").each(function() {
		if(!$(this).hasClass('valid')){
			inputs_valid = false;
		}
	});
	if(inputs_valid){
		$(".button__proceed").removeAttr('disabled');
	} else {
		$(".button__proceed").attr('disabled', true);
	}
}

$(document).ready(function() {
	var email_regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	$("input[type='email']").keyup(function() {
		if(email_regex.test($(this).val())) {
			$(this).addClass('valid');
		} else {
			$(this).removeClass('valid');
		}
		all_valid();
	});

	$("input[type='password']").keyup(function() {
		if($(this).val().length >= 8) {
			$(this).addClass('valid');
		} else {
			$(this).removeClass('valid');
		}
		all_valid();
	});
});
$(".button__proceed").click(function(event) {
	event.preventDefault();
	button = $(this);
	button.addClass('in-progress');
	setTimeout(function(){
		button.removeClass('in-progress');
		notification.change("error","Network error","Sorry <a href='/home'>we</a> have no servers");
	},2000)
});