var generate={quesiton_template:"<div draggable='true'></div>",answer_template:"<div class='task__answer__item' draggable='true'></div>","text-wrapper":function(e,t){var a=$(generate.quesiton_template);t||(t=prompt("text pls",""));var n=a.addClass("text-wrapper").text(t).attr("pos",e).attr("contenteditable","false");return n},"input__inner-label":function(e,t){var a=$(generate.answer_template).html("<input type='text' name='text_question' placeholder='Ответ' class='input__inner-label'><label for='text_question'></label>");return t||(t=prompt("Question angain pls","")),a.find("label").text(t),a.find("task__answer__item").attr("pos",e),a}};