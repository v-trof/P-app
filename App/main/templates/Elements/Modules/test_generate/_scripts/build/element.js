generate.build.element = function(element_class, value, additional) {
	var blueprint = generate.read(element_class).element

	var $element = blueprint.build(value)

	if(additional) {
		blueprint.boundaries = blueprint.boundaries
								.concat(additional.boundaries);
	}

	blueprint.boundaries.forEach(function(boundary_name) {
		boundary_name($element)
	});
	{% if not attempt  %}
		if(value.answer) {
			$element.attr('answer', value.answer);
			if (typeof blueprint.fill === "undefined") {
				console.error("NOFILL", element_class);
			} else {
			blueprint.fill($element, value.answer);	
			}

		}
	{% endif %}

	return $element;
}