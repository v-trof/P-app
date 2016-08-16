generate.data["answer--textarea"]= {
	element: {
		type: "answer",
		parse: function($original) {

			return {
				label: $original.find('label').html(),
				class: "answer--textarea",
				type: "answer",
				answer: 'Оценка выставляется преподавателем',
				worth: generate.data.shared.worth.element.parse($original)
			}
		},
		build: function(value) {
			$element = $(generate.build.template.answer("answer--textarea"))
			$element.html('{% include "Elements/Inputs/text/textarea/exports.html" %}')
			$element.find("label").text(value.label)
			$element.attr('answer', 'Оценка выставляется преподавателем');
			generate.data.shared.worth.element.build($element, value.worth);

			inline_editor.start($element.find('.__value')[0]);
			return $element 
		},
		getter: function($element, _action) {
			
			function upload_value() {
				var data = $element.find(".__value").html();
				var value = $element.find(".__value").text().substring(0, 40);
				_action(value, data);
			}

			var timer;
			var typing_interval = 1000;

			$element.change(function() {
				upload_value();
			});
			
			$element.keydown(function(event) {
				$element.keydown(function() {
					clearTimeout(timer); 
					timer = setTimeout(function() {
						upload_value();
					}, typing_interval);
				});
			});
			upload_value();
		},

		fill: function($element, answer) {
			console.log(answer);
			$element.find('.__value').html(answer);
			$element.find('label').addClass('m--top');
		},

		value_sample: {
			label: "Большой текстовый ответ"
		}
	},
	edit: {
		text: '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__textarea/exports.html" %}',
		parse: function() {
			return {
				label: $("#new_element_label").val(),
				worth: generate.data.shared.worth.edit.parse()
			}
		},
		middleware: function() {
			generate.data.shared.worth.edit.middleware();
		},
		fill: function(value) {
			$("#new_element_label").val(value.label).focus();
			generate.data.shared.worth.edit.fill(value.worth);
		}
	}
}
