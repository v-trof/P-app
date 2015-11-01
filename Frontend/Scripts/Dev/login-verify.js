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

var email_regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

function check_email(e_input) {
	console.log('checking',e_input);
	if(email_regex.test(e_input.val())) {
		e_input.addClass('valid');
	} else  {
		e_input.removeClass('valid');
	}
	all_valid();
}

$(document).ready(function() {
	
	$("input[type='email']").on("blur keyup change click", function(){
		var input = $(this);
		check_email(input);

		setTimeout(function(){
			check_email(input)
		}, 2000);
		setTimeout(function() {
			check_email(input)
		}, 10000);
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