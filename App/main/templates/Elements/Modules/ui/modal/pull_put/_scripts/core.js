var pull_put = {
  is_pulled: false,
  reset_sync: false,
  reset_default: function() {},
  reset: function() {
    pull_put.pre_actions.reset();
    //real reset
    pull_put.ui.element = undefined;
    pull_put.ui.hide();
    $placeholder.remove();
    pull_put.ui.$.find(".__content").removeAttr('state');
    if (typeof tooltip !== 'undefiend') {
      tooltip.hide();
    }
    pull_put.cancel_action();
  },
  /**
   * Contains all functinos invoked before actual action
   * @type {Object}
   */
  pre_actions: {
    cancel: function() {},
    save: function() {},
    delete: function() {},
    add: function() {},
    reset: function() {},
    pull: function($pulled) {},
    put: function($put_zone, $pulled) {}
  },

  actions: {
    add: function() {}
  },
  cancel_action: function() {}
}
