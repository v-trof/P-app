function add_to_item_list(element_class, $list) {
	
	var template = '<div class="card"></div>';
	//real actions
	var value_sample = generate.data[element_class].element.value_sample;

	var $element = generate.build.element(
		element_class,
		value_sample,
		{
			boundaries: []
		}
	)

	var $finished = $(template).html($element);
	

	pull_put.puller.add(
		$element,
		[],
		generate.edit.preview_action,
		function() {
			var preview_width = $(".preview .__content").width();

			pull_put.ui.$.css("margin-left", -preview_width/2);
			pull_put.ui.$.find(".__content").css("width",
				preview_width
			);
			
			generate.edit.start();
		},
		true,
		true);

	$list.append($finished);
}

$(document).ready(function() {
	for(var element_class in generate.data) {
		if(element_class == "shared") {
			continue;
		}
		var blueprint = generate.data[element_class].element;

		var type = blueprint.type;

		if( ! blueprint.nopull) {
			var $list = $(".item-list.--" + type);
			add_to_item_list(element_class, $list)
		}
	}
});