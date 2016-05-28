generate.data["--text"] = {
	element: {
		type: 'answer',
		
		parse: function($original) {
			console.log($original.attr('answer'))
			return {
				label: $original.find('label').html(),
				answer: $original.attr('answer')
			}
		},

		build: function(value) {
			$element = $(generate.build.template.answer('--text'))
			$element.html('{% include "Elements/Inputs/text/exports.html" %}')
			$element.find('label').text(value.label)
			return $element 
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

			console.log($('#new_element_label').val());

			return {
				'label': label,
				'answer': answer
			}
		},
		fill: function(value) {
			$("#new_element_answer").val(value.answer).focus();
			
			$("#new_element_label").val(value.label).focus();
		}
	}
}