generate.data.shared.assets = {}
generate.data.shared.file_changed=false;

generate.data.shared.assets.last_id = 0
generate.data.shared.assets.get_id = function() {
	generate.data.shared.assets.last_id++;
	return generate.data.shared.assets.last_id;
}

generate.data.shared.catch_asset_file = function() {
	generate.data.shared.file_changed = false;
	$file_input = pull_put.ui.$.find(".input.--file");

	new_id = generate.data.shared.assets.get_id();

	generate.data.shared.assets[new_id] = file_catcher.add($file_input);

	$file_input.change(function(event) {
		generate.data.shared.file_changed = true;
	});
}