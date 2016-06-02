generate.build.element = function(element_class, value, addtitional) {
	var blueprint = generate.read(element_class).element

	var $element = blueprint.build(value)

	if(addtitional) {
		blueprint.boundaries = blueprint.boundaries
								.concat(addtitional.boundaries);
	}

	blueprint.boundaries.forEach(function(boundary_name) {
		boundary_name($element)
	});

	{% if not attempt %}
		$element.attr('answer', value.answer)
		// console.log($element.attr('answer'))
	{% endif %}
	
	return $element;
}