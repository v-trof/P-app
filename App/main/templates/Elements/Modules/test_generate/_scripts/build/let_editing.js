{% if not attempt %}
generate.let_editing = function($element) {
	pull_put.puller.add(
		$element,
		["add", "save", "delete"],
		generate.edit.edit_action,
		undefined,
		false,
		true);

	generate.edit.add_put_zone($element, function($this, $pulled) {
		$this.after($pulled);
	})

	return $element;
}
{% endif %}