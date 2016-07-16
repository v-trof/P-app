
$(".sources").on("click", ".card.--file", function(){
	if(edit.editing) {
		$source = $(this).parent();

		var file_cahnged=false;

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
				file_cahnged=true;
			});

			$("#upload_source").click(function(event) {
				console.log(source_id, full_link, file_link, file_name);
				if(file_cahnged) {
					upload_file(true, source_id);
				} else {
					file_to_upload.name = file_name;
					file_to_upload.link = file_link;
					upload_source(true);
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
}

edit.start = function() {
	$(".sources .--card").each(function(index, el) {
		$(this).replaceTag("<div>", true);
	});

	$(".sources .--card").each(function(index, el) {
		$(this).click();
	});

	$(".sources .card").each(function(index, el) {
		var source_id = $(this).parent().attr("id");
		button_delete.add($(this), $(this).parent(), function() {
			delete_source(source_id);
			popup.hide();
		});
	});
}

$.extend({
	replaceTag: function (currentElem, newTagObj, keepProps) {
		var $currentElem = $(currentElem);
		var i, $newTag = $(newTagObj).clone();
		if (keepProps) {//{{{
			var nodes=[], values=[];
			newTag = $newTag[0];
			for (var att, i = 0, atts = currentElem.attributes,
			 n = atts.length; i < n; i++) {
				att = atts[i];
				newTag.setAttribute(att.nodeName, att.value);
			}
			$.extend(newTag.classList, currentElem.classList);
			$.extend(newTag.attributes, currentElem.attributes);
		}//}}}
		$currentElem.wrapAll($newTag);
		$currentElem.contents().unwrap();
		// return node; (Error spotted by Frank van Luijn)
		return this; // Suggested by ColeLawrence
	}
});

$.fn.extend({
	replaceTag: function (newTagObj, keepProps) {
		// "return" suggested by ColeLawrence
		return this.each(function() {
			jQuery.replaceTag(this, newTagObj, keepProps);
		});
	}
});