var edit = (function(exports) {
	exports = {
		editing: false,
		start: function() {},
		end: function() {},
		save_changes: function() {},
	}
	return exports;
})();

$(document).ready(function() {
	$linkbox = $(".linkbox").last();

	$linkbox.append('<a class="--card">'
		+ '<button class="--flat" id="edit_toggle">Редактировать'
		+ '</button></a>');
	$linkbox.append('<a class="--card">'
		+ '<button class="--flat" id="edit_discard">Отмена'
		+ '</button></a>');
	$("#edit_discard").hide()

	$("#edit_toggle").click(function(event) {
		if(edit.editing) {
			edit.editing = false;
			edit.end();
			$("#edit_toggle").text("Редактировать");
			$("#edit_discard").hide();
		} else {
			edit.editing = true;
			edit.start();
			$("#edit_toggle").text("Сохранить изменения")
			$("#edit_discard").show();

		}
	});

	$("#edit_discard").click(function(event) {
		location.reload();
	});
});