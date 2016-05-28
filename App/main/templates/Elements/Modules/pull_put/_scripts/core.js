var pull_put = {
	is_pulled: false,
	reset: function() {
		pull_put.ui.element = undefined;
		pull_put.ui.hide();
		$placeholder.remove();
	}
}