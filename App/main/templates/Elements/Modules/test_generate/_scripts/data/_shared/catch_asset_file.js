generate.data.shared.assets = {}

generate.data.shared.assets.last_id = 0
generate.data.shared.assets.get_id = function() {
	generate.data.shared.assets.last_id++;
	return generate.data.shared.assets.last_id;
}

generate.data.shared.catch_asset_file = function() {
	$file_input = pull_put.ui.$.find(".input.--file");

	new_id = generate.data.shared.assets.get_id();
	console.log($file_input);

	generate.data.shared.assets[new_id] = file_catcher.add($file_input);
}