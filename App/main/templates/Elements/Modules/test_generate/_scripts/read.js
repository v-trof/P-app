generate.read = function(element_class) {
	var raw_data = generate.data[element_class]

	var element_data = {
		"build": raw_data.element.build,
		"parse": raw_data.element.parse,
		"type": raw_data.element.type,
		"getter": raw_data.element.getter
	}
	
	if( ! element_data.boundaries) {
		element_data.boundaries = []
	}
	
	var edit_data = raw_data.edit

	return {
		"element": element_data,
		"edit": edit_data,
	}
}