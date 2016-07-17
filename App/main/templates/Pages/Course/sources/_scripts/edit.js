$(".sources").on("click", ".card.--file", function(){
	if(edit.editing) {
		$source = $(this).parent();

		var file_changed=false;

		popup.show('{% include "Pages/Course/sources/_popup_texts/add/exports.html" %}',
		function() {
			var source_id = $source.attr("id");
			var full_link = $source.attr("href");
			var file_link = full_link.split("/")[full_link.split("/").length-1];
			var file_name = $source.find(".__name").text();

			$("#upload_file").parent().find(".__text").text(file_link);
			$("#filename").val(file_name);

			file_to_upload.catcher = file_catcher.add($("#upload_file").parent());
			$("#upload_file").change(function() {
				file_changed=true;
			});

			$("#upload_source").click(function(event) {
				console.log(source_id, full_link, file_link, file_name);
				if(file_changed) {
					upload_file(source_id);
				} else {
					file_to_upload.name = $("#filename").val();
					file_to_upload.link = file_link;
					upload_source(source_id);
				}
			});
		});
	};	
})

edit.end = function() {
	$(".--button-delete").remove();
	$(".sources .--card").each(function(index, el) {
		$(this).replaceTag("<a>", true);
	});

	$(".sources .--card").each(function(index, el) {
		$(this).attr("tip", "Нажмите, чтобы скачать");
	});
}

edit.start = function() {
	$(".sources .--card").each(function(index, el) {
		$(this).replaceTag("<div>", true);
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