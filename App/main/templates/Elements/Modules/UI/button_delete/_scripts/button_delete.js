var button_delete = (function() {
  var template = loads.get('Elements/Modules/UI/button_delete/');

  var exports = {
    add: function($element, $deletable, _callback) {
      //if callback passed second
      if (typeof $deletable === 'function') {
        _callback = $deletable;
        $deletable = undefined;
      }

      if (typeof $deletable === 'undefined') {
        $deletable = $element;
      }

      $element = $element.first();

      $button = $(template);

      $element.append($button);

      $button.click(function(event) {
        event.preventDefault();
        if (_callback) {
          _callback();
        }
        $deletable.remove();
      });
    }
  }

  return exports;
})();
