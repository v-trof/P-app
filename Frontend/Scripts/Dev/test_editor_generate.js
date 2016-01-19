var generate  = {
	queued_el: $("<div>Ждем-с</div>"),
	quesiton_template : "<div draggable='true'></div>",
	answer_template : function(el_class) {
		return "<div class='"+el_class+" task__answer__item' draggable='true'></div>"
	},
	"texts" : {
		"text-wrapper": function(prefill){return "<input type='text' id='new_el_value' value="+prefill+"><label>Текст вопроса</label><br><br><button id='add_el'>Добавить</button>"},
		"text-answer": function(prefill){return "<input type='text' id='new_el_value' value="+prefill.label+"><label>Формат ответа</label><br><br><input type='text' id='new_el_answer' value="+prefill.answer+"><label>Верный ответ</label><br><br><button id='add_el'>Добавить</button>"}
			
	},
	"text-wrapper" : function(value, original) {
		var quesiton_template = $(generate.quesiton_template); //lets us modfy freely
		console.log(original);
		if(!value){
			var prefill;
			if( ! original){
				prefill="";
			} else {
				prefill = original.text();
			}
			popup.show(generate.texts["text-wrapper"](prefill),{}, function() {
				// console.log("add_el");
				$("#add_el, #overlay__bg").click(function(event) {
					// console.log("add_el");
					popup.hide();
					c_element = generate["text-wrapper"]($("#new_el_value").val());
					generate.queued_el.replaceWith(c_element);
					add_boundary.draggable(c_element);
					add_boundary.question(c_element);
				});
			});
			var content = generate.queued_el;
		} else {
			var content = quesiton_template.addClass('text-wrapper').html(value);
		}
		console.log(content);
		return content;
	},
	"text-answer": function(value, answer, original) {
		
		if(!value){
			var prefill;
			if( ! original){
				prefill = {
					"label": "",
					"answer": ""
				}
			} else {
				prefill = {
					"label": original.find("label").text(),
					"answer": original.attr('answer')
				}
			}
			popup.show(generate.texts["text-answer"](prefill),{}, function() {
				// console.log("add_el");
				$("#add_el").click(function(event) {
					// console.log("add_el");
					popup.hide();
					c_element = generate["text-answer"]($("#new_el_value").val(), $("#new_el_answer").val());
					generate.queued_el.replaceWith(c_element);
					add_boundary.draggable(c_element);
					add_boundary.answer(c_element);
				});
			});
			var content = generate.queued_el;
		} else {
			console.log(answer);
			var content = $(generate.answer_template("text-answer")).attr("answer", answer).html("<input type='text' placeholder='Ответ' disabled><label>"+value+"</label>");
		}
		return content;
	}
}