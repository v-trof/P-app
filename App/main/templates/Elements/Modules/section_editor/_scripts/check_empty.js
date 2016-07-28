section_editor.check_empty = function($section) {
	//all
	if($section === '_all') {
		section_editor.$parent.find(section_editor.section_selector)
		.each(function(index, el) {
			section_editor.check_empty($(this))
		})
		section_editor.move_unordered()
		return false
	}

	//one
	if( $section.children(section_editor.item_selector).length == 0 ) {
		//is_empty
		if( $section.children('.--empty').length == 0 ) {
			//empty state is not displayed
			$section.append(section_editor.create_empty())
		}
	} else {
		//is not empty
		$section.children('.--empty').remove()
	}
}


section_editor.create_empty = function() {
	var $empty = $('<div class="--empty">'
					+ section_editor.empty_message
				+ '</div>')

	indicator.add($empty, 'add', 1)

	//putzone
	pull_put.put_zone.add($empty, function(event, $this, $put) {
		$this.after($put)
		pull_put.reset()

		indicator.hide(1)
		section_editor.check_empty('_all')
	}, section_editor._put_callback)

	return $empty
}
