{% if not attempt %}
generate.let_editing = function($element) {
	pull_put.puller.add($element,
		["add", "delete"],
		generate.edit.edit_action,
		undefined,
		false,
		true);

	pull_put.put_zone.add($element, 
		function() {
			$element.after(pull_put.ui.element);
			generate.let_editing(pull_put.ui.element);
			// pull_put.puller.cancel();
		})

	return $element;
}
{% endif %}