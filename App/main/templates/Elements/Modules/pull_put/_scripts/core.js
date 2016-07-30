var pull_put = {
	is_pulled: false,
	reset: function() {
		pull_put.ui.element = undefined;
		pull_put.ui.hide();
		$placeholder.remove();
    // console.log(pull_put.cancel_action);
    pull_put.cancel_action();
	},
  cancel_action: function() {

  }
}
