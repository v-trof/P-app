var pull_put = {
	is_pulled: false,
	reset: function() {
		pull_put.ui.element = undefined;
		pull_put.ui.hide();
		$placeholder.remove();
    if(typeof tooltip !== 'undefiend') {
      tooltip.hide();
    }
    // console.log(pull_put.cancel_action);
    pull_put.cancel_action();
	},
  cancel_action: function() {

  }
}
