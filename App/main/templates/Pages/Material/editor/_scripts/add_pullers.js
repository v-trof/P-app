generate.let_editing = function($element) {
	pull_put.puller.add(
		$element,
		["delete", "save"],
		generate.edit.preview_action,
		generate.edit.start,
		false,
		true
	)

	pull_put.put_zone.add($element, function(event, $element, $pulled) {
		$element.after($pulled);
		// generate.let_editing();
		// console.log($pulled);
		editor.check_self();

		pull_put.reset();
	});
}