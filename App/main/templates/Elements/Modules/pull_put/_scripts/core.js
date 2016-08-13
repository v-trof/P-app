var pull_put = {
	is_pulled: false,
  reset_sync: false,
  reset_default: function() {
    pull_put.ui.element = undefined;
    pull_put.ui.hide();
    $placeholder.remove();
    pull_put.ui.$.find(".__content").removeAttr('state');
    if(typeof tooltip !== 'undefiend') {
      tooltip.hide();
    }
		pull_put.cancel_action();
  },
  reset: function() {
    if(pull_put.reset_sync) {
      pull_put.pre_reset(pull_put.reset_default);
    } else {
      // console.log('default_reset');
      pull_put.reset_default()
    }
	},
  pre_reset: function() {
    // console.log("default_pre_reset");
    pull_put.reset_default();
  },
  cancel_action: function() {}
}
