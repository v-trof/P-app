var generate  = {
	quesiton_template : "<div draggable='true'></div>",
	answer_template : "<div class='task__answer__item' draggable='true'></div>",
	"text-wrapper" : function(pos, value) {
		var quesiton_template = $(generate.quesiton_template); //lets us modfy freely
		if(!value){
			value = prompt("text pls","");
			if(value == ""){
				return undefined;
			}
		}
		var content = quesiton_template.addClass('text-wrapper').text(value).attr("pos", pos).attr("contenteditable", "false");
		return content;
	},
	"input__inner-label": function(pos, value) {
		var content = $(generate.answer_template).html("<input type='text' name='text_question' placeholder='Ответ' disabled><label for='text_question'></label>");
		if(!value){
			value = prompt("Question angain pls", "");
		}
		console.log(content);
		content.find("label").text(value);
		content.attr("pos", pos);
		return content;
	}
}