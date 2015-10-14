$(document).ready(function() {
		prepare_selects();
		$(".select__option").click(function(event) {
			var select = $(this).parent().parent().parent(); // .select>.select__mask>.select__body>select__option
			var mask = $(this).parent().parent();
			
			var modifiers=select.attr('modifiers').split(',');
			var	size = parseInt(modifiers[0]);
			var	optionHeight = parseInt(modifiers[1]);
			var pos=parseInt(modifiers[2]);;

			if(select.hasClass('open')){
				mask.css('height', optionHeight+'px');
				mask.css("margin-top","0");
				$(this).parent().css('margin-top', -($(this).attr("value")-1)*(optionHeight)+"px");
				modifiers[2]=$(this).attr("value");
				select.attr('modifiers',modifiers.join(","));
				select.removeClass('open');
			} else {
				size = parseInt(modifiers[0]);
				optionHeight = parseInt(modifiers[1]);
				mask.height(size*optionHeight+"px");
				mask.css("margin-top",-(pos-1)*optionHeight+"px");
				$(this).parent().css('margin-top', "0");
				select.addClass('open');
			}
			
		});
});	

function prepare_selects(){
	$(".select").each(function(index, el) {
		if(!$(this).attr('modifiers')){
			size=$(this).children(".select__mask").children(".select__body").children('.select__option').length;
			optionHeight=$(this).children(".select__mask").children(".select__body").children('.select__option').innerHeight();	
			$(this).attr('modifiers',size+','+optionHeight+","+1);
		}
	});
}