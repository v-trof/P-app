section_editor.end_section_editing = function($section, dont_replace) {
	var $items = $section.children(section_editor.item_selector)
	$items.each(function(index, el) {
		$(this).removeAttr("tip");
	});
	
	//end heading edition
	$section.find(section_editor.heading_selector)
		.removeClass('m--editing')
		.attr('contenteditable', 'false')

	//remove button_delete
	$section.find('.m--button-delete').remove()

	//replace_tags
	if(section_editor.replace 
		 && ( ! defined(dont_replace) || !dont_replace) ) {
		$items.replaceTag(section_editor.items_old_tag, true)
	}
}
