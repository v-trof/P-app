generate.data["answer--text"] = {
	element: {
		type: 'answer',
		
		parse: function($original) {
			return {
				label: $original.find('label').html(),
				answer: $original.attr('answer'),
				class: "answer--text",
				type: "answer",
				worth: generate.data.shared.worth.element.parse($original)
			}
		},

		build: function(value) {
			$element = $(generate.build.template.answer('answer--text'));
			$element.html('{% include "Elements/Inputs/text/exports.html" %}');
			$element.find('label').text(value.label);

			generate.data.shared.worth.element.build($element, value.worth);

			return $element;
		},

		fill: function($element, answer) {
			console.log(answer);
			$element.find('input').val(answer);
			$element.find('label').addClass('--top');
		},

		getter: function($element, _action) {
			var timer;
			var typing_interval = 1000;

			$element.on('change', function() {
				var value = $element.find('.__value').val();
				clearTimeout(timer); 
				_action(value);
			});
			
			$element.keydown(function(event) {
				$element.keydown(function() {
					clearTimeout(timer); 
					timer = setTimeout(function() {
						var value = $element.find('.__value').val();
						_action(value);
					}, typing_interval);
				});
			});
		},
		value_sample: {
			label: "Текстовый ответ"
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__text/exports.html" %}',
		parse: function() {
			var label = $('#new_element_label').val()
			var answer = $('#new_element_answer').val()

			return {
				label: label,
				answer: answer,
				worth: generate.data.shared.worth.edit.parse()
			}
		},
		middleware: function() {
			generate.data.shared.worth.edit.middleware();
		},
		fill: function(value) {
			$('#new_element_answer').val(value.answer).focus();			
			$('#new_element_label').val(value.label).focus();
			generate.data.shared.worth.edit.fill(value.worth);
		}
	}
}
