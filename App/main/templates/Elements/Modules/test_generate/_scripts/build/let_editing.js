{% if not attempt and not read %}
generate.let_editing = function($element) {
	pull_put.puller.add(
		$element,
		["add", "save", "delete"],
		generate.edit.edit_action,
		function() {
			indicator.show(1);
		},
		false,
		true);

	indicator.add($element, 'down', 1);
	generate.edit.add_put_zone($element, function($this, $pulled) {
		$this.after($pulled);
	})

	return $element;
}
{% endif %}