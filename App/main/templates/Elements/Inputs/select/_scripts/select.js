function add_menu_caller(select) {

	$(select).append('<option value="">Выберите...</option>')

	var last_option = $(select).children('option').last();
	
	setTimeout(function(){
		var max_w = 0;
		$(select).children('option').each(function(index, el){
			max_w = Math.max($(this).outerWidth(), max_w);
		});
		$(select).children('.__display').css('min-width', max_w + "px");
	},300);
	
	$(select).children('input').val(last_option.attr("value"));
	$(select).children(".__display").text(last_option.text());
	
	$(select).click(function(e) {
		var options = [];
		var chosen = {};
		var is_disabled = $(this).attr('disabled');

		if(is_disabled == "disabled"){
			// console.log("DIs")
			return 0
		}
		var current_value = $(this).children('input').val();
		$(this).children('option').each(function(index, el) {
			if($(this).attr("value") != current_value){
				options.push({
					text : $(this).text(),
					value: $(this).attr("value")
				})
			} else {
				chosen = {
					text : $(this).text(),
					value: $(this).attr("value")
				}
			}
		});
		if(!chosen) {
			chosen = options[0]
		}
		if(is_disabled != "disabled" && is_disabled !="true"){
			// console.log(is_disabled, "2sel")
			context_menu.show(options, this, chosen);
		}
	});
}

$(document).ready(function() {
	$(".--select").each(function(index, el) {
		add_menu_caller(this);
	});
});