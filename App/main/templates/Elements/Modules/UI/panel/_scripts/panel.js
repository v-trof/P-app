var panel = (function() {

  var $all = $(loads.get('Elements/Modules/UI/panel/'));

  var $panel = $all.find(".__content");
  var $actions = $all.find(".__actions");

  var exports = {
    $: $all,
    content: $panel,
    actions: $actions,
    used: false,
    shown: false,
    show: function(content, _callback, css) {
      $panel.html(content)
      this.used = true;
      this.shown = true;

      if (css) {
        $panel.css(css)
      }

      if (_callback) {
        _callback()
      }
      if (typeof tooltip !== 'undefined') {
        tooltip.hide();
      }
      $all.css('transform', 'none');
    },
    hide: function() {
      this.shown = false;
      $all.css('transform', 'translateX(16.5rem)')
    },
    change_actions: function(actions, _callback) {
      $actions.html(actions)

      if (_callback) {
        _callback()
      }
    }

  }
  return exports;
})();


$(document).ready(function() {
  $("body").append(panel.$);
  panel.hide();
});
