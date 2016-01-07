var messages = {
	email_invalid: "Возможно, тут опечатка",
	password_invalid: "Минимум 8 символов"
}

function all_valid(){
	inputs_valid = true
	$("input:visible").each(function() {
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
var name_last_name_regex = /^[^\s]+\s[^\s]+$/;

function check_email(input) {
	if(email_regex.test($(input).val())) {
		$(input).addClass('valid');
		tooltip.hide();
	} else  {
		$(input).removeClass('valid');
		if(!tooltip.is_shown && $(input).is(':focus')) {
			tooltip.show(input, messages.email_invalid);
		}
	}
	$("input[type='password']").val().length >= 8 ? ($("input[type='password']").addClass("valid"), tooltip.hide()) : ($("input[type='password']").removeClass("valid"), tooltip.is_shown || tooltip.show("input[type='password']", messages.password_invalid)), all_valid();
	all_valid();
}

$(document).ready(function() {
	$("input[type='email']").on("blur keyup change click", function(){
		var input = this;
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
			tooltip.hide();
		} else {
			$(this).removeClass('valid');
			if(!tooltip.is_shown){
				tooltip.show(this, messages.password_invalid);
			}
		}
		all_valid();

		$("input").blur(function(event) {
			tooltip.hide();
		});
	});

	//for registration
	$("input[name='name_last_name']").on("blur keyup change click",function(){
		if(name_last_name_regex.test($(this).val())) {
			$(this).addClass('valid');
		} else  {
			$(this).removeClass('valid');
		}
	all_valid();
	});
});

$(".button__proceed").click(function(event) {
	event.preventDefault();
	button = $(this);
	button.addClass('in-progress');
});