
function offset_bottom(el){
	return $(window).height() - $(el).height() -$(el).offset().top
}

function offset_right(el){
	return $(window).width() - $(el).width() -$(el).offset().left
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
		el_height = c_rect.height;
		c_rect_bottom = offset_bottom(el);
		c_rect_right = offset_right(el);
		//tooltip on the right
		if(Math.abs(el_height-t_height)<16 && c_rect_right>t_width && t_width<el_width){
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
			if(t_height < c_rect.top){
				$("#tooltip").css({
					top: c_rect.top - t_height + 'px',
					left: c_rect.left + 'px'
				});
			} else {
				$("#tooltip").css({
					top: c_rect.top + el_height + 'px',
					left: c_rect.left + 'px'
				});
			}
		}

		$("#tooltip").css('opacity', '1');
		tooltip.is_shown = true;
	},
	hide : function(){
		$("#tooltip").css('opacity', '0');
		tooltip.is_shown = false;
	},
	generate : {
		mark__tooltip : function(description){
			var heading = "<h5 class='tooltip__heading'>«" + description.name + "»</h5>";
			var results = "<div class='.tooltip__results--test'>" +description.percentage + "%<span>("+description.done + " из " + description.total + ")</span></div>";
			var date = "<div class='.tooltip__date--test'>"+humanize.date(description.date)+"</div>";
			return heading + results + date;
		}
	}
}





