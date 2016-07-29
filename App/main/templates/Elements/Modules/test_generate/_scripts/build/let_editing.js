{% if not attempt and not read %}
generate.let_editing = function($element) {
	pull_put.puller.add(
		$element,
		this.editing_actions,
		this.edit.edit_action,
		function() {
			indicator.show(1);
		},
		false,
		true);

	indicator.add($element, 'down', 1);
	this.edit.add_put_zone($element, function($this, $pulled) {
		$this.after($pulled);
	})

	return $element;
}
{% endif %}
