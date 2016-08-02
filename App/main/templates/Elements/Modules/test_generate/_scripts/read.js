generate.read = function(element_class) {
	// console.log(element_class);
	var raw_data = generate.data[element_class]

	var element_data = raw_data.element
	
	if( ! element_data.boundaries) {
		element_data.boundaries = []
	}
	
	var edit_data = raw_data.edit

	return {
		"element": element_data,
		"edit": edit_data,
	}
}
