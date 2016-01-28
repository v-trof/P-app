var pack_input = {
	"block--empty" : function(){
		return {
			"class": "block--empty",
			"label": "none",
			"answer": "none"
		}	
	},
	"text-answer" : function(el){
		return {
			"class": "text-answer",
			"label": $(el).children('label').text(),
			"answer": $(el).attr('answer')
		}
	}
}

var pack_question = {
	"text-wrapper" : function(el){
		return {
			"class": "text-wrapper",
			"value": $(el).html(),
		}
	},
	"image-wrapper" : function(el){
		return {
			"class": "image-wrapper",
			"value": $(el).children('img').attr("src"),
		}
	},
}

var test = {
	pack: function(){
		var testfile = {
			"title" : $(".test__heading").text(),
			"author": "{{teachername}}",
			"tasks" : []
		};
		$(".task__content").each(function(index, el) {
			var c_task = {
				"question_items": [],
				"answer_items" : []
			};
			$(this).children('.task__question').children().each(function(index, el) {
				var c_class = this.classList[0];
				// console.log(c_class)
				c_task.question_items.push(pack_question[c_class](this));
			});
			//answer shit need coplete revision
			$(this).children('.task__answer').children().each(function(index, el) {
				var c_class = this.classList[0];
				// console.log(c_class)
				c_task.answer_items.push(pack_input[c_class](this));
			});
			testfile.tasks.push(c_task);
		});
		console.log(testfile);
		var json = JSON.stringify(testfile);
		console.log(json);
	},
	unpack: function(json_file) {
		console.log(json_file);
		var testfile = JSON.parse(json_file);
		testfile.tasks.forEach(function(task_data){
			generate.task(task_data);
		});
	}
}

$(document).ready(function() {
	$("#test_save").click(function(event) {
		test.pack();
	});
});