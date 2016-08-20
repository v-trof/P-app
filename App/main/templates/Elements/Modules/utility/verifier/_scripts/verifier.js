var verifier = (function() {
  var expressions = {
    email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
    words2: /^[^\s]+\s[^\s]+$/,
    password: /.{8,}/
  }
  var typing_interval = 2000;

  function verify($input, expression) {
    if ($input.val()) {
      if (expression.test($input.val())) {
        $input.addClass('m--valid');
        $input.removeClass('m--invalid');
        return true
      } else {
        $input.removeClass('m--valid');
        $input.addClass('m--invalid');
      }
    } else {
      $input.removeClass('m--valid');
      $input.removeClass('m--invalid');
    }
    return false
  }
  exports = {
    verify: verify,
    expressions: expressions,
    add: function($input, expression) {
      if (typeof expression === "string") {
        expression = expressions[expression];
      }

      verify($input, expression);

      var timer;
      $input.keydown(function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
          verify($input, expression);
        }, typing_interval);
      });
      $input.blur(function() {
        verify($input, expression);
      })
    }
  }
  return exports;
})();
