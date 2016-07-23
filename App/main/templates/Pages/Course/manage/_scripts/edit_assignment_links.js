$(document).ready(function() {
	var button_sample = function(id) {
		var icon = '{% include "Elements/Icons/edit.svg" %}';
		var $link = $('<a><button class="--ghost --icon"></button></a>');
		$link.find("button").append(icon);
		$link.attr("href", "edit_task/?task_id="+id);

		$link.addClass('--button-delete');
		return $link;
	}

	$('.--assignment').each(function(index, el) {
		var id = $(this).attr("id").split("_")[1];
		$(this).append(button_sample(id));
	});

});