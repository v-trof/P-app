//sample
var mark_descriptions = {
	kursA: {
		m4: {
			type : "Тест",
			name : "a",
			percentage : 1,
			done : 156,
			total : 10000,
			date : "18.10.2015"
		},
		m5: {
			type : "Тест",
			name : "Плеоназмы",
			percentage : 74,
			done : 14,
			total : 19,
			date : "12.10.2015"
		}
	}
}

function offset_bottom(el){
	return $(window).height() - $(el).height() -$(el).offset().top
}

var tooltip = {
	is_shown : false,
	show : function(el, content, css, callback){
		if(tooltip.is_shown){
			tooltip.hide();
		}
		$(".tooltip__content").html(content);
		t_width = $("#tooltip").outerWidth();
		t_height = $("#tooltip").outerHeight();
		c_rect = el.getBoundingClientRect();
		el_width = c_rect.width;
		console.log(offset_bottom(el));
		el_height = c_rect.height;
		c_rect_bottom = offset_bottom(el);
		//tooltip on the right
		if(Math.abs(el_height-t_height)<16 && c_rect.right>t_width && t_width<el_width){
			$("#tooltip").css({
				height: el_height+'px',
				top: c_rect.top + 'px',
				left: c_rect.left + el_width + 'px',
			});
		//bottom centered
		} else if(t_width>el_width) {
			if(t_height < c_rect_bottom){
				$("#tooltip").css({
					top: c_rect.top + el_height+'px',
					left: (c_rect.left - t_width/2 + el_width/2) + "px"
				});
			//top centered
			} else {
				$("#tooltip").css({
					top: c_rect.top - t_height +'px',
					left: (c_rect.left - t_width/2 + el_width/2) + "px"
				});
			}
		} else {
			$("#tooltip").css({
				top: c_rect.top - t_height + 'px',
				left: c_rect.left + 'px'
			});
		}

		$("#tooltip").css('opacity', '1');
		tooltip.is_shown = true;
	},
	hide : function(){
		$("#tooltip").css('opacity', '0');
		tooltip.is_shown = false;
	}
}





