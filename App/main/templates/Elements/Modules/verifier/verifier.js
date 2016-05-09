var verifier = (function() {
	var expressions = {
		email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
		words2:  /^[^\s]+\s[^\s]+$/,
		password:  /.{8,}/
	}
	var typing_interval = 3000;

	function verify($input, expression) {
		console.log("verifying:", $input);
		if($input.val()) {
			if( expression.test($input.val()) ) {
				$input.addClass('--valid');
				$input.removeClass('--invalid');
			} else {
				$input.removeClass('--valid');
				$input.addClass('--invalid');
			}
		} else {
			$input.removeClass('--valid');
			$input.removeClass('--invalid');
		}
	}
	exports = {
		add: function($input, expression) {
			if(typeof expression === "string") {
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

