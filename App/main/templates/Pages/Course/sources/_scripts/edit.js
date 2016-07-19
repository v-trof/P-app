

edit.end = function() {
	$(".--button-delete").remove();
	$(".sources .--card").each(function(index, el) {
		$(this).replaceTag("a", true);
	});

	$(".sources .--card").each(function(index, el) {
		$(this).attr("tip", "Нажмите, чтобы скачать");
	});
}

edit.start = function() {
	$(".sources .--card").each(function(index, el) {
		$(this).replaceTag("div", true);
	});

	$(".sources .--card").each(function(index, el) {
		$(this).attr("tip", "Нажмите, чтобы редактировать");
	});

	$(".sources .card").each(function(index, el) {
		var source_id = $(this).parent().attr("id");
		button_delete.add($(this), $(this).parent(), function() {
			delete_source(source_id);
			popup.hide();
		});
	});
}