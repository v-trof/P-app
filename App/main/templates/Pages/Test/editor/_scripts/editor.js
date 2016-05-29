var editor = (function() {
	var check_numbers = function() {
		$(".__task .__number").each(function(index, el) {
			$(this).text(index+1)
		});
	}

	var check_for_emptiness = function()  {
		$(".__task .__question").each(function(index, el) {
			if($(this).children().length == 0){
				$empty = $("<div class='--empty'>Добавьте сюда вопрос</div>");
				
				$(this).append($empty);

				generate.edit.add_puller($empty, function($this, $pulled) {
					$this.replaceWith($pulled);
				});
			}
		});

		$(".__task .__answer").each(function(index, el) {
			if($(this).children().length == 0) {
				var $empty = $("<div class='--empty'>Добавьте сюда поле ответа</div>");
				
				$(this).append($empty);

				generate.edit.add_puller($empty, function($this, $pulled) {
					$this.replaceWith($pulled);
				});
			}
		});
	}

	var exports = {
		check_self: function() {
			check_for_emptiness();
			check_numbers();
		} 
	}
	return exports;
})();

$("body").on("click", "button", function() {
	editor.check_self();
})