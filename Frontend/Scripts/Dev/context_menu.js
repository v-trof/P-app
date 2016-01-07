context_menu = {
	show: function(el, options, checked) {
		if(context_menu.is_shown){
			context_menu.hide();
		}
		c_rect = el.getBoundingClientRect();

		if(checked){
			context_menu.build_select(el, options, checked);
		} else {
			context_menu.build(options);
		}
		$("#context-menu").css({
			"top": c_rect.top + "px",
			"left": c_rect.left + "px",
			"width": c_rect.width + "px",
			"opacity": 1
		});
	},

	hide: function() {
		$("#context-menu").css('opacity', '0');
		setTimeout(function(){
			$("#context-menu").css('top', '-100%');
		},300);
	},

	build: function(options) {
		$("#context-menu").html("");
		options.forEach(function(option) {
			$("#context-menu").append("<div class='context-menu__option' onclick='" + option.func + "()'>" + option.text + "</div>");
		});
	},
	build_select: function(el, options, checked) {
		$("#context-menu").html("");
		$("#context-menu").append("<div class='context-menu__option default' onclick='" + checked.value + "()'>" + checked.text + "</div>")
		options.forEach(function(option){
			$("#context-menu").append("<div class='context-menu__option' value='" + option.value + "'>" + option.text + "</div>");
		});
		$(".context-menu__option").click(function(event) {
			context_menu.hide();
			$(el).val($(this).attr('value'));
			console.log(el,$(this).attr('value'));
		});
	},

}

function add_menu_caller(select) {

	$(select).click(function(e) {
		var select = this;
		var options = [];
		var checked = {};
		$(select).children('option').each(function(index, el) {
			if($(this).attr("value") != $(select).val()){
				options.push({
					text : $(this).text(),
					value: $(this).attr("value")
				})
			} else {
				checked = {
					text : $(this).text(),
					value: $(this).attr("value")
				}
			}
		});
		console.log(this);
		context_menu.show(this, options, checked);
	});
	//for spped
	select.addEventListener("click", function(e) {
		e.preventDefault();
		var elem = this;
		elem.style.visibiliy = "hidden";
		setTimeout(function() { elem.disabled = false; }, 0);
	});
}

$(document).ready(function() {
	$("select").each(function(index, el) {
		add_menu_caller(this);
	});
});