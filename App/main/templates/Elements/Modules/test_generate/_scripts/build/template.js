generate.build.template = {
	question: function(element_class) {
		console.log(element_class);
		return "<div class='"+element_class+" __question-element'></div>"
	},
	answer: function(element_class) {
		return "<div class='"+element_class+" __answer-field'></div>"
	},
	task: '{% include "Elements/Modules/test_generate/__templates/__task/exports.html" %}'
}