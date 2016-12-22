section_editor.start_section_editing = function($section) {
	// console.log(typeof $section, $section);
	if(typeof $section === 'function') return;

	var $items = $section.children(section_editor.item_selector)

	//start heading edition
	$section.find(section_editor.heading_selector)
		.addClass('m--editable')
		.addClass('m--editing')
		.attr('contenteditable', 'true')

	//add button_delete
	button_delete.add($section, function() {
		section_editor.$unordered.append($items)
		section_editor.check_empty(section_editor.$unordered)
	})

	$section.find('.m--button-delete')
		.addClass('m--l-2')
		.addClass('m--top-centered')
		.css('top', $section.find('.m--accordion-toggle').css('top'))

	//replace_tags
	if(section_editor.replace) {
		if( defined($items[0]) ) {
			section_editor.items_old_tag = $items[0].tagName
		}

		$items.replaceTag('div', true)
		$items = $section.children(section_editor.item_selector)
	}

/*	console.log(
		$section !== section_editor.$unordered,
		$section,
		section_editor.$unordered)
*/
	//pull_put things for items
	$items.each(function(index, el) {
		var was_unpublished = $(this).hasClass('m--was-unpublished');
		//add pullers
		// console.log(this);
		pull_put.puller.add(
			$(this),
			section_editor.pull.actions,
			section_editor.pull.additional,
			function() {
				// console.log('2')
				indicator.show(2);
				if(!was_unpublished) {
					// console.log('1')
					indicator.show(1)
					section_editor.pull.func();
          $(section_editor.item_selector).removeAttr("tip");
          section_editor.$add_button.hide();
				}
			}
		)

		if(was_unpublished) {
			 indicator.add($(this), section_editor.item_indicator, 2)
		} else {
			 indicator.add($(this), section_editor.item_indicator, 1)
		}

		pull_put.put_zone.add($(this), function(event, $this, $put) {
			if($put.hasClass('m--was-unpublished')) {
				// console.log("WUNP", $this.parent() === section_editor.$unordered);
				if(!was_unpublished) return;
			}
			$this.after($put)
			pull_put.reset()
		}, function($put_zone) {
			section_editor.check_empty('_all')
			section_editor._put_callback($put_zone)
		})
	})
}
