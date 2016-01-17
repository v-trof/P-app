var counter = 0;
var original_el = undefined;
var drop_el = undefined;
var firefox = navigator.userAgent.indexOf("Firefox") != -1;
// console.log( navigator.userAgent);

function check_bg_height() {
	if($(".test__bg").outerHeight() != $(".test")[0].scrollHeight){
		// console.log($(".test__bg").outerHeight(), $(".test")[0].scrollHeight)
		$(".test__bg").css('height', $(".test")[0].scrollHeight+'px');
	}
}

var e_data = {
	data: [],
	setData: function(prop, value) {
		this.data[prop] = value;
	},
	getData: function(prop){
		return this.data[prop];
	}
}

function drag_reset() {
	counter = 0;
	$(".drop--accept").removeClass('drop--accept');
	$(".moved").removeClass('moved');
	indicator.hide();
	ripple.dissolve();
	//so it doesen't exist when new el must be crated
	original_el = undefined;
	$(".test>svg").css({
		'transform': '',
		'opacity': 0
	});
}


var indicator = {
	original_el : {},

	show: function(c_rect) {
		$("#indicator").css({
			width: c_rect.width + "px",
			height: c_rect.height + "px",
			left: c_rect.left + "px",
			top: c_rect.top + "px"
		});
	},

	hide : function() {
		$("#indicator").css({
			width: 0,
			height: 0,
			left: 0,
			top: 0
		});
	}
}

function drag_over(e) {
	// console.log("over");
	if (e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
		e.stopPropagation();
	}

	return false;
}








var editor = {
	verify_type : function() {
		// console.log("verify_type");
		if($("#move").is(':checked')) {
			$(".task__answer__item, .task__question>*").attr('draggable', 'true');
			$(".block--empty").removeAttr("draggable");
			$("[contenteditable]").attr('contenteditable', 'false');
		} else {
			$(".test__preview [draggable]").removeAttr("draggable");
			$("[contenteditable]").attr('contenteditable', 'true');
			$(".task__answer__item *").css('cursor', 'pointer');
		}
	},
	check_for_emptiness : function()  {
		$(".task__question").each(function(index, el) {
			// console.log($(this).children());
			if($(this).children().length == 0){
				$(this).append("<div class='block--empty'>Добавьте сюда вопрос</div>");
				add_boundary.block_empty($(this).children('.block--empty'));
			}
		});
		$(".task__answer").each(function(index, el) {
			if($(this).children().length == 0){
				$(this).append("<div class='block--empty'>Добавьте сюда поле ответа</div>");
				add_boundary.block_empty($(this).children('.block--empty'));
			}
		});
	}
}

var add_boundary = {
	draggable: function(el) {
		el.bind({
			dragover: function(e) {
				drag_over(e);
			},

			dragstart: function(e) {
				this.classList.add('moved');
				//ff fix
				e.originalEvent.dataTransfer.setData('useless', 'stupid firefox');
			},

			dragend: function(e) {
				drag_reset();
			},
		});
	},




	question: function(el) {
		el.bind({
			dragenter: function(e) {
				if( e_data.getData("el_type") == "question" ) {
					// console.log(counter, counter == 0);
					if(counter == 0) {
						this.classList.add('drop--accept');
						c_rect = this.getBoundingClientRect();
						indicator.original_el = this;
						indicator.show(c_rect);
					}
					counter++;
					// console.log(counter);
				}
			},

			dragleave: function(e) {
				counter--;
				// console.log("OUT",counter);
				if(counter<=0) {
					counter = 0;
					this.classList.remove('drop--accept');
					indicator.hide();
				}
			},

			dragstart: function(e) {

				 e_data.setData("el_type", "question");
				 e_data.setData("el_class", $(this).attr("class").split(" ")[0]);
				original_el = this;
			},

			drop: function(e) {
				// console.log(e, e_backup, e_backup.e);
				if("question" == e_data.getData("el_type")) {
					if(original_el) {
						$(this).after($(original_el).attr('pos', parseInt($(this).attr("pos"))+1));
						editor.check_for_emptiness();
					} else {
						append_test_item($(this), e_data.getData("el_class"), e_data.getData("el_type"));
					}
				}
			}
		});
	},



	answer: function(el) {
		// console.log(el);
		el.bind({
			dragenter: function(e) {
				if( e_data.getData("el_type") == "answer" ) {
					if(counter == 0) {
						this.classList.add('drop--accept');
						c_rect = this.getBoundingClientRect();
						indicator.original_el = this;
						indicator.show(c_rect);
					}
					counter++;
				}
			},

			dragstart: function(e) {

				e_data.setData("el_type", "answer");
				e_data.setData("el_class", $(this).children('input').attr("class"));
				original_el = this;
			},

			dragleave: function(e) {
				counter--;
				if(counter<=0) {
					counter = 0;
					this.classList.remove('drop--accept');
					indicator.hide();
				}
			},

			drop: function(e) {
				if("answer" == e_data.getData("el_type")) {
					if(original_el) {
						$(this).after($(original_el).attr('pos', parseInt($(this).attr("pos"))+1));
						editor.check_for_emptiness();
					} else {
						append_test_item($(this), e_data.getData("el_class"),e_data.getData("el_type"));
					}
				}
			}
		});
	},




	block_empty: function(el) {
		el.bind({
			dragover: function(e) {
				drag_over(e);
			},

			dragenter: function(e) {
				if($(this).parent().attr('class').split(" ")[0].split("__")[1] == e_data.getData("el_type")) {
					this.classList.add('drop--accept');
				}
			},

			dragleave: function(e) {
				if($(this).parent().attr('class').split(" ")[0].split("__")[1] == e_data.getData("el_type")) {
					this.classList.remove('drop--accept');
				}
			},

			drop: function(e) {
				var parent = $(this).parent();


				if(parent.attr('class').split(" ")[0].split("__")[1] == e_data.getData("el_type")) {
					if(original_el) {
						$(this).replaceWith($(original_el).attr('pos', '1'));
						editor.check_for_emptiness();
					} else {
						$(this).replaceWith(generate[e_data.getData("el_class")](1));
						new_el = $(parent.children()[0]);

						// console.log(new_el);

						add_boundary.draggable(new_el);
						add_boundary[e_data.getData("el_type")](new_el);
					}
				}
			}
		});
	},

	new_question : function(el) {
		el.bind({
			dragover: function(e) {
				drag_over(e);
			},

			dragenter: function(e) {
				console.log(this);
				console.log("in", counter);
				if(counter==0) {
					ripple.force_show(e.originalEvent, test_bg, "accent");
					$(".test>svg").css({
						'transform': 'translateY(-50px)',
						'opacity': 1,
					});
				}
				counter++;
			},

			dragleave: function(e) {
				console.log("out", counter);
				counter--;
				if(counter==0) {
					ripple.dissolve();
					$(".test>svg").css({
						'transform': '',
						'opacity': 0
					});
				}
			},

			drop: function(e) {
				console.log("drop", counter);
				if (e.stopPropagation) {
					e.stopPropagation(); // stops the browser from redirecting.
				}
				if(counter > 0){
					create_question(e_data.getData("el_type"), e_data.getData("el_class"), original_el);
				}
			}
		});
	},
}






$(document).ready(function() {
	editor.verify_type();
	$("#editor__type").click(function(event) {
		editor.verify_type();
	});

	$(".answer__field").bind({
		dragstart: function(e) {
			e_data.setData("el_type", "answer");
			e_data.setData("el_class", $(this).children('input').attr("class").split(" ")[0]);
			//ff fix
			e.originalEvent.dataTransfer.setData('useless', 'stupid firefox');
		},

		dragend: function(e) {
			drag_reset();
		}
	});

	$(".question-elements>*").bind({
		dragstart: function(e) {
			// console.log("start");
			e_data.setData("el_type", "question");
			e_data.setData("el_class", $(this).attr("class"));
			//ff fix
			e.originalEvent.dataTransfer.setData('useless', 'stupid firefox');
		},

		dragend: function(e) {
			// console.log("end");
			drag_reset();
		}
	});

	test_bg = $(".test__bg").get(0);

	$(".test__bg, .test>svg").each(function(index, el) {
		add_boundary.new_question($(this));
	});
	$("#indicator").bind({
		dragover: function(e) {
			drag_over(e);
		},

		dragenter: function(e) {
			counter++;
			indicator.original_el.classList.add('drop--accept');
			indicator.show(original_el.c_rect);
			// console.log(counter);
		},

		dragleave: function(e) {
			counter--;
			if(counter<=0) {
				indicator.original_el.classList.remove('drop--accept');
				indicator.hide();
				counter = 0;
			}
		},

		drop: function(e) {
			if (e.stopPropagation) {
				e.stopPropagation(); // stops the browser from redirecting.
			}
			$(indicator.original_el).trigger("drop", [{e:e}]);
		}
	})
});