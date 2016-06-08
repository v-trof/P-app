function sort_by_text($parent, key) {
	$parent = $($parent).first();

	var $children = $parent.children();
	var keyarr = [];

	$children.each(function(index, el) {
		keyarr.push($(this).find(key).text());
	});

	keyarr.sort();

	console.log($parent);
	while(keyarr.length > 0) {
		console.log(keyarr);
		$children.each(function(index, el) {
			if($(this).find(key).text() == keyarr[0]) {
				$parent.append($(this));
				keyarr.splice(0,1);
			}		
		});
	}
}