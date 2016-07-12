function add_pullers($element) {
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
		add_pullers($pulled);
		pull_put.reset();
	});
}