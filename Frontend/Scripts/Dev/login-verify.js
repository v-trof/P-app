var messages = {
	email_invalid: "example_email@service.domain",
	password_invalid: "Минимум 8 символов"
}

var password_field = {}; 

function all_valid(){
	var inputs_valid = true;
	$("input:visible").each(function() {
		if(!$(this).hasClass('valid')){
			inputs_valid = false;
			// console.log(this);
		}
	});

	if(inputs_valid){
		$(".button--proceed").removeAttr('disabled');
	} else {
		$(".button--proceed").attr('disabled', true);
	}
}

var email_regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
var name_last_name_regex = /^[^\s]+\s[^\s]+$/;


function check_password(input){
	console.log(input);
	if($(input).val().length >= 8) {
		$(input).addClass('valid');
		tooltip.hide();
	} else {
		$(input).removeClass('valid');
		if(!tooltip.is_shown&& $(input).is(':focus')){
			tooltip.show(input, messages.password_invalid);
		}
	}
	all_valid();
}

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
	check_password(password_field);
}

$(document).ready(function() {
	password_field = $("input[type='password']").get(0);
	$("input[type='email']").on("blur keyup change click", function() {
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
		check_password(this);		
	});

	$("input").blur(function(event) {
		tooltip.hide();
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

	$(".button--proceed").click(function(event) {
		button = $(this);
		button.addClass('in-progress');
	});

	check_email();
});