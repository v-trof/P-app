generate.data["answer--textarea"]= {
	element: {
		type: "answer",
		parse: function($original) {
			return {
				label: $original.find('label').html(),
				class: "answer--text"
			}
		},
		build: function(value) {
			$element = $(generate.build.template.answer("answer--textarea"))
			$element.html('{% include "Elements/Inputs/text/textarea/exports.html" %}')
			$element.find("label").text(value.label)
			return $element 
		},
		getter: function($element, _action) {
			$element.on("blur mouseout", function() {
				var value = $element.find(".__value").text();
				_action($element, value);
			});
		},
		value_sample: {
			label: "Большой текстовый ответ"
		}
	},
	edit: {
		text: '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__textarea/exports.html" %}',
		parse: function() {
			return {
				label: $("#new_element_label").val()
			}
		},
		fill: function(value) {
			$("#new_element_label").val(value.label).focus();
		}
	}
}