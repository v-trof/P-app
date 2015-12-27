function fix_table(){
	heading_widths = [];
	$("th").each(function(index, el) {
		cur_width = $(this).innerWidth();
		/*console.log(
			$(this).innerWidth(),
			$(this).outerWidth(),
			$(this).width(),
			this.getBoundingClientRect().width
		);*/
		heading_widths.push(cur_width);
	});

	$("tr").each(function(index, el) {
		if( ! $(this).hasClass('divider')){
			$(this).children('td').each(function(index, el) {
				$(this).css('width', heading_widths[index]+"px");
			});
		}
	});

	$('th').each(function(index, el) {
		$(this).css('width', heading_widths[index]+"px");
	});
}


$(document).ready(function() {
	fix_table()
	st_pos = $("thead").offset().top;
	th_height = $("thead").height();
	$(".content").scroll(function(event) {
		scroll_pos = $(".content").scrollTop();

		if(scroll_pos + 36 > st_pos){
			$("thead").addClass('scrolled');
			$("tbody").css('transform', 'translateY(36px)');
		} else {
			$("thead").removeClass('scrolled');
			$("tbody").css('transform', 'translateY(0)');;
		}
	});
});