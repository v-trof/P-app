generate.data["answer--checkbox"] = {
	element: {
		type: 'answer',
		
		parse: function($original) {
			return generate.data.shared
				.options.element.parse($original, "checkbox");
		},

		build: function(value) {
			if (value.answer) {
				value.answer = value.answer.join(', ');
			}
			
			$element = $(generate.build.template.answer('answer--checkbox'))
			
			value.values.forEach(function(label) {
				var $new_option = $('{% include "Elements/Inputs/checkbox/exports.html" %}');
				$new_option.children("label").text(label);
				$new_option.children("input").val(label);
				$new_option.children("input")
					.attr("name", "c_"+generate.counter.checkbox);
				$element.append($new_option);
			});

			generate.counter.checkbox++;

			return $element 
		},
		getter: function($element, _action) {
			$element.change(function(event) {
				var values = [];
				$element.find(":checked").each(function(index, el) {
					values.push( $(this).val() );
				});;
				_action(values.join(", "));
			});
			
		},
		value_sample: {
			values: ["Вариант 1", "Вариант 2", "Вариант 3"]
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__checkbox/exports.html" %}',
		parse: function() {
			var result = generate.data.shared.options.edit.parse("checkbox");

			return result
		},
		middleware: function() {
			generate.data.shared.options.edit.middleware("checkbox");
		},
		fill: function(value) {
			generate.data.shared.options.edit.fill(value);
		}
	}
}