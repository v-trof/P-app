function add_file_boundary(el){
	$(el).click(function(e) {
		$(this).children('input')[0].click();
	});

	$(el).children("input").change(function(e) {
		$(el).children('span').text($(this).val());
	});
}

$(document).ready(function() {
	$(".file").each(function(index, el) {
		add_file_boundary(this);
	});
});