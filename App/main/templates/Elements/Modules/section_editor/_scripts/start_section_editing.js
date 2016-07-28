section_editor.start_section_editing = function($section) {
	console.log(typeof $section, $section);
	if(typeof $section === 'function') return;
	
	var $items = $section.children(section_editor.item_selector)

	//start heading edition
	$section.find(section_editor.heading_selector)
		.addClass('--editable')
		.addClass('--editing')
		.attr('contenteditable', 'true')

	//add button_delete
	button_delete.add($section, function() {
		section_editor.$unordered.append($items)
		section_editor.check_empty(section_editor.$unordered)
	})

	$section.find('.--button-delete')
		.addClass('--l-2')
		.addClass('--top-centered')
		.css('top', $section.find('.--accordion-toggle').css('top'))

	//replace_tags
	if(section_editor.replace) {
		if( defined($items[0]) ) {
			section_editor.items_old_tag = $items[0].tagName
		}

		$items.replaceTag('div', true)
		$items = $section.children(section_editor.item_selector)
	}

	//pull_put things for items
	$items.each(function(index, el) {
		//add pullers
		pull_put.puller.add(
			$(this),
			section_editor.pull.actions,
			section_editor.pull.additional,
			function() {
				indicator.show(1)
			}
		)

		indicator.add($(this), 'down', 1)

		pull_put.put_zone.add($(this), function(event, $this, $put) {
			$this.after($put)
			pull_put.reset()
			indicator.hide(1)
		}, function($put_zone) {
			section_editor.check_empty('_all')
			section_editor._put_callback($put_zone)
		})
	})
}
