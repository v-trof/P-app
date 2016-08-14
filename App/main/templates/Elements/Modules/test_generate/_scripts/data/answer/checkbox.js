generate.data["answer--checkbox"] = {
	element: {
		type: 'answer',
		
		parse: function($original) {
			var result = generate.data.shared.options
											.element.parse($original, "checkbox");

			result.worth = generate.data.shared.worth.element.parse($original);
			return result;
		},

		build: function(value) {			
			$element = $(generate.build.template.answer('answer--checkbox'));

			value.values.forEach(function(label) {
				var $new_option = $('{% include "Elements/Inputs/checkbox/exports.html" %}');
				$new_option.children("label").text(label);
				$new_option.children("input").val(label);
				$new_option.children("input")
					.attr("name", "c_"+generate.counter.checkbox);
				$element.append($new_option);
			});

			generate.data.shared.worth.element.build($element, value.worth);
			generate.counter.checkbox++;

			return $element;
		},

		fill: function($element, checked) {
			$element.find("input").each(function(index, el) {
				var value = $(this).val();

				if(checked.indexOf(value) > -1) {
					$(this).prop('checked', true);	
				}
			});
		},

		getter: function($element, _action) {
			$element.change(function(event) {
				var values = [];
				$element.find(":checked").each(function(index, el) {
					values.push( $(this).val() );
				});;
				_action(values.join(", "), values);
			});
			
		},
		
		value_sample: {
			values: ["Вариант 1", "Вариант 2", "Вариант 3"]
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__checkbox/exports.html" %}',
		parse: function() {
			var result = generate.data.shared
											.options.edit.parse("checkbox");

			result.worth = generate.data.shared.worth.edit.parse();

			return result;
		},
		middleware: function() {
			generate.data.shared.options.edit.middleware("checkbox");
			generate.data.shared.worth.edit.middleware();
		},
		fill: function(value) {
			generate.data.shared.options.edit.fill(value);
			generate.data.shared.worth.edit.fill(value.worth);
		}
	}
}
