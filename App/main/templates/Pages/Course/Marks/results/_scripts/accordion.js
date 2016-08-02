$(document).ready(function() {
	$('.students .group').each(function() {
		accordion.add($(this), 'h3');
		$(this).find('.card.--user a').each(function(index, val) {
			var href = $(this).attr('href');
			var id = href.split('/')[href.split('/').length - 1];
			$(this).parent().attr('id', id);
			$(this).replaceTag('div');
		});

    show_marks($(this));
	});
});
