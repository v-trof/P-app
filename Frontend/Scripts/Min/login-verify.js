function all_valid(){var e=!0;$("input:visible").each(function(){$(this).hasClass("valid")||(e=!1)}),e?$(".button--proceed").removeAttr("disabled"):$(".button--proceed").attr("disabled",!0)}function check_password(e){console.log(e),$(e).val().length>=8?($(e).addClass("valid"),tooltip.hide()):($(e).removeClass("valid"),!tooltip.is_shown&&$(e).is(":focus")&&tooltip.show(e,messages.password_invalid)),all_valid()}function check_email(e){email_regex.test($(e).val())?($(e).addClass("valid"),tooltip.hide()):($(e).removeClass("valid"),!tooltip.is_shown&&$(e).is(":focus")&&tooltip.show(e,messages.email_invalid)),check_password(password_field)}var messages={email_invalid:"example_email@service.domain",password_invalid:"Минимум 8 символов"},password_field={},email_regex=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,name_last_name_regex=/^[^\s]+\s[^\s]+$/;$(document).ready(function(){password_field=$("input[type='password']").get(0),$("input[type='email']").on("blur keyup change click",function(){var e=this;check_email(e),setTimeout(function(){check_email(e)},2e3),setTimeout(function(){check_email(e)},1e4)}),$("input[type='password']").keyup(function(){check_password(this)}),$("input").blur(function(e){tooltip.hide()}),$("input[name='name_last_name']").on("blur keyup change click",function(){name_last_name_regex.test($(this).val())?$(this).addClass("valid"):$(this).removeClass("valid"),all_valid()}),$(".button--proceed").click(function(e){button=$(this),button.addClass("in-progress")}),check_email()});