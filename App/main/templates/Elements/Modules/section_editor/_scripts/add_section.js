section_editor.add_section = function() {
	if( ! section_editor.init_done) return;
	$new_section = section_editor.$section_template.clone()

	section_editor.$parent.append($new_section)
	
	accordion.add($new_section, section_editor.heading_selector)
	section_editor.start_section_editing($new_section)
	
	section_editor.check_empty($new_section)
	section_editor.move_unordered()

	return $new_section
}