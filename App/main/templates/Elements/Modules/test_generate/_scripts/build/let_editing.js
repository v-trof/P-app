{% if not attempt and not read %}
generate.let_editing = function($element) {
	if(! $element.hasClass('m--pullable')) {
		pull_put.puller.add(
			$element,
			this.editing_actions,
			this.edit.edit_action,
			function() {
				indicator.show(1);
			},
			false,
			true);
	}
	
	if(! $element.hasClass('m--put-zone')) {
		indicator.add($element, 'down', 1);
		this.edit.add_put_zone($element, function($this, $pulled) {
			$this.after($pulled);
			generate.let_editing($pulled);
		})
	}

	return $element;
}
{% endif %}
