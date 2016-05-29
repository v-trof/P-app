{% if not attempt %}
generate.let_editing = function($element) {
	pull_put.puller.add($element,
		["add", "delete"],
		generate.edit.edit_action,
		undefined,
		false,
		true);

	generate.edit.add_puller($element, function($this, $pulled) {
		$this.after($pulled);
	})

	return $element;
}
{% endif %}