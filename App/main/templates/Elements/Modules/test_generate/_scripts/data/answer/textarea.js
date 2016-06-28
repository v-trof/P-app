generate.data["answer--textarea"]= {
	element: {
		type: "answer",
		parse: function($original) {

			return {
				label: $original.find('label').html(),
				class: "answer--textarea",
				type: "answer"
			}
		},
		build: function(value) {
			$element = $(generate.build.template.answer("answer--textarea"))
			$element.html('{% include "Elements/Inputs/text/textarea/exports.html" %}')
			$element.find("label").text(value.label)
			return $element 
		},
		getter: function($element, _action) {
			var timer;
			var typing_interval = 1000;

			$element.on("change", function() {
				var value = $element.find(".__value").text().substring(0, 17);
				_action(value);
			});
			
			$element.keydown(function(event) {
				$element.keydown(function() {
					clearTimeout(timer); 
					timer = setTimeout(function() {
						var value = $element.find(".__value").text().substring(0, 17);
						_action(value);
					}, typing_interval);
				});
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