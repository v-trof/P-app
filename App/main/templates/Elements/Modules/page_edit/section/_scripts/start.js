edit.start = function() {
	//enable puller
	pull_put.is_pulled = false
	section_editor.$add_button.show()

	section_editor.$parent
		.find(section_editor.section_selector).each(function(index, el) {
			section_editor.start_section_editing($(this))
		})

	section_editor.end_section_editing(section_editor.$unordered, true)

	section_editor.edit_start()
}