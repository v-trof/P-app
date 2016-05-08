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
	$linkbox = $(".linkbox");
	$linkbox.append('<a class="--card" id="edit_toggle">'
		+ '<div class="card --small">Редактировать'
		+ '</div></a>');
	$linkbox.append('<a class="--card">'
		+ '<div class="card --small" id="edit_discard">Отмена'
		+ '</div></a>');
	$("#edit_discard").hide()

	$("#edit_toggle").click(function(event) {
		if(edit.editing){
			edit.editing = false;
			edit.end();
			$("#edit_toggle > .card.--small").text("Редактировать");
			$("#edit_discard").hide();
		} else {
			edit.editing = true;
			edit.start();
			$("#edit_toggle > .card.--small").text("Сохранить изменения")
			$("#edit_discard").show();

		}
	});

	$("#edit_discard").click(function(event) {
		location.reload();
	});
});