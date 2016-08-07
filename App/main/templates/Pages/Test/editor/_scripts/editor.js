/*var editor = (function() {
	var check_numbers = function() {
		$(".__task .__number").each(function(index, el) {
			$(this).text(index+1)
		});
	}

	var check_for_emptiness = function()  {
		$(".__task .__content").each(function(index, el) {
			if($(this).children(".__question-element").length == 0
				) {
				if($(this).children('.question--empty').length == 0) {
					$empty = $("<div class='question--empty m--empty'>Добавьте сюда вопрос</div>");
				
					indicator.add($empty, 'add', 1);
					$(this).prepend($empty);

					generate.edit.add_put_zone($empty, function($this, $pulled) {
						$this.replaceWith($pulled);
					});
				}
			} else {
				$(this).children('.question--empty').remove();
			}
		});

		$(".__task .__content").each(function(index, el) {
			if(
				$(this).children(".__answer-field").length == 0
			) {
				if($(this).children('.answer--empty').length == 0) {
					var $empty = $("<div class='answer--empty m--empty'>Добавьте сюда поле ответа</div>");

					indicator.add($empty, 'add', 1);
					$(this).append($empty);

					generate.edit.add_put_zone($empty, function($this, $pulled) {
						$this.replaceWith($pulled);
					});
				}

			} else {
				$(this).children('.answer--empty').remove();
			}
		});
	}

	var check_pullers = function() {
		$(".__task>.__content").children().each(function(index, el) {
			if(
				(
					   ! $(this).hasClass('m--pullable')
					|| ! $(this).hasClass('m--put-zone')
				) && ! $(this).hasClass('m--empty')
			) {
				generate.let_editing($(this));
			}
		});
	}

	var exports = {
		check_self: function() {
			check_for_emptiness();
			check_numbers();
			check_pullers();
		} 
	}
	return exports;
})();
*/
