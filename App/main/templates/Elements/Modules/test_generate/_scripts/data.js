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
			if (value.answer) {
				value.answer = value.answer.join(', ');
			}
			
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
			checked = checked.split(", ");

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
				_action(values.join(", "));
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

generate.data["answer--classify"] = {
  element: {
    type: 'answer',
    
    parse: function($original) {
      var result = {
        class: "answer--classify",
        type: "answer",
        worth: generate.data.shared.worth.element.parse($original),
        answer: false,
        values: {
          classes: [],
          items: []
        }
      }
      
      if($original.attr('answer')) {
        result.answer = JSON.parse($original.attr("answer"));
      }

      $original.children('.__class').each(function(index, el) {
        result.values.classes.push($(this).find('h3').text());
        $(this).find('.__item').each(function(index, el) {
           result.values.items.push($(this).text());
        });
      });

      return result;
    },

    _shared: {
      create_item: function(text) {
        var $new_item = $('<div class="__item">'
          + text
          + '</div>');

        return $new_item;
      }
    },

    build: function(value) {
      var self = this;

      var create_class = function(title) {
        var $new_class =  $('<div class="__class">'
          + '<h3>' + title + '</h3>'
          + '<div class="__items"></div>'
          + '</div>');

        $new_class.find('.__items')
          .append('<div class="m--empty">Пусто</div>');


        return $new_class;
      }

      

      var $element = $(generate.build.template.answer('answer--classify'));
      $element.addClass("m--classify");

      value.values.classes.forEach(function(title){
        $element.append(create_class(title));
      });

      $element.append('<div class="__class m--unordered"><div class="__items"></div></div>');

      value.values.items.forEach(function(text){
        $element.find('.m--unordered .__items').append(
          self._shared.create_item(text));
      });

      generate.data.shared.worth.element.build($element, value.worth);

      return $element;
    },

    fill: function($element, answer) {
      var self = this;
      answer = JSON.parse(answer)
      // console.log(answer);
      // .remove();

      for(title in answer) {
        $element.find('h3').each(function(index, el) {
          if(title === $(this).text()){
            //right class
            var $class = $(this).parent();
            
            //removing empty
            if(answer[title].length) {
              $class.find('.m--empty').remove();
            }
            
            //addign items
            answer[title].forEach(function(text) {
              $class.find('.__items').append(
                 self._shared.create_item(text));

              $element.find('.m--unordered .__item').each(function(index, el) {
              if($(this).text() === text) {
                $(this).remove();
              } 
              });
            });
            return;
          }
        });
      }

      if($element.find('.m--unordered .__item').length === 0) {
        $element.find('.m--unordered').remove();
      }
    },

    counter: 1,
    getter: function($element, _action) {
      var self=this;
      indicator_index = self.counter;
      self.counter += 1;

      function update() {
        var answer = {};
        $element.children('.__class').each(function(index, el) {
          var title = $(this).find('h3').text();
          answer[title] = []
          $(this).find('.__item').each(function(index, el) {
             answer[title].push($(this).text());
          });
        });
        // console.log(answer)
        _action("(Вопрос)Классификация", JSON.stringify(answer));
      }

      function check() {
        $('.__items').each(function() {
          if($(this).children('.__item').length === 0) {
            if($(this).children('.m--empty').length === 0) {
              $(this).append('<div class="m--empty">Пусто</div>');
            }
          } else {
            $(this).children('.m--empty').remove();
          }
        });
        if($element.find('.m--unordered .__item').length === 0) {
          $element.find('.m--unordered').remove();
        }
        update();
      }

      //add putzones
      $element.find('.__class:not(.m--unordered)').each(function(index, el) {
        pull_put.put_zone.add($(this), function(event, $this, $pulled) {
          if($pulled.hasClass('classy_item_'+indicator_index)) {
            $this.find('.__items').append($pulled);
            pull_put.reset();
            indicator.hide(indicator_index);
            check();
          }
        });
        indicator.add($(this).find('.__items'), 'add', indicator_index);
        // console.log(indicator_index);
      });

      //add pullers
      $element.find('.__item').each(function(index, el) {
        $(this).addClass('classy_item_'+indicator_index)
        pull_put.puller.add(
          $(this), //element
          [], //actions 
          undefined, //additional
          function() {
            indicator.show(indicator_index);
          },
          false,
          true
        )
      });
    },
    
    value_sample: {
      values: {
        classes:  ["Глаголы", "Существительные"],
        items: ["Дом", "Стол", "Писать"]
      }
    }
  },
  edit: {
    text:  '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__classify/exports.html" %}',
    parse: function() {
      var answer = {}, values = {classes: [], items: []};
      var $element = $(".pull_put_ui .m--classify");

      //loop over classes
      $element.children('.__class').each(function(index, el) {
        var title = $(this).children('h3').text();
        answer[title] = [];
        values.classes.push(title);

        //loop over items
        $(this).find('input').each(function() {
          if(this.value) { 
            answer[title].push(this.value);
            values.items.push(this.value);
          }
        });
      });
      
      return {
        values: values,
        answer: JSON.stringify(answer),
        worth: generate.data.shared.worth.edit.parse()
      }
    },
    _shared: {
      create_class: function() {
        var $new_class = $('<div class="__class">'
          + '<h3 class="m--editable m--editing" contenteditable>Название</h3>'
          + '<div class="__items"></div>'
          + '</div>');
        $new_class.find('.__items').append(
          $('.__new-item').first().clone().removeAttr('style')
        );
        button_delete.add($new_class);

        return $new_class;
      },
      create_item: function() {
        var item_input = '<div class="__item m--input">{% include "Elements/Inputs/text/exports.html" with class="__item-input" placeholder="Текcт элемента" %}</div>';
        var $new_item = $(item_input);
        button_delete.add($new_item);
        return $new_item;
      }
    },
    middleware: function() {
      var self = this;

      $('.m--classify').on('click', '.__new-item', function() {
        var $new_item = self._shared.create_item();
        $(this).before($new_item);
      });

      $('.m--classify .__new-class').click(function() {
        var $new_class = self._shared.create_class();
        $(this).before($new_class);
      });
    },

    fill: function(value) {
      var $element = $(".pull_put_ui .m--classify");
      // console.log(value)
      
      if( ! value.answer) {
        value.answer = {
          "Название": []
        };
      }


      //drawing classes
      for(title in value.answer) {
        var self = this;
        
        var $new_class = self._shared.create_class();
        $new_class.find('h3').text(title);

        value.answer[title].forEach(function(text) {
          var $new_item = self._shared.create_item();
          $new_item.find('input').val(text);
          
          setTimeout(function() {
            $new_item.find('input').focus().blur();
          }, 100);
          
          $new_class.find('.__new-item')
            .before($new_item);
        });
        $('.m--classify .__new-class').before($new_class);
      }

      generate.data.shared.worth.edit.fill(value.worth);
    }
  }
}

generate.data["answer--empty"] = {
	element: {
		type: "answer",
		nopull: true,
		parse: function($original) {
			return {
				text: "Добавьте сюда поле ответа",
				class: "answer--empty",
				type: "answer"
			}
		},
		build: function(value) {
			return $("<div class='m--empty answer--empty'>Добавьте сюда поле ответа</div>");
		},
		value_sample: {
			text: "answer"
		}
	},
	edit: {}
}

generate.data["answer--radio"] = {
	element: {
		type: 'answer',
		
		parse: function($original) {
			var result = generate.data.shared
											.options.element.parse($original, "radio");

			result.worth = generate.data.shared.worth.element.parse($original);
			return result;
		},

		build: function(value) {
			$element = $(generate.build.template.answer('answer--radio'))
			
			value.values.forEach(function(label) {
				var $new_option = $('{% include "Elements/Inputs/radio/exports.html" %}');
				$new_option.children("label").text(label);
				$new_option.children("input").val(label);
				$new_option.children("input")
					.attr("name", "r_"+generate.counter.radio);
				$element.append($new_option);
			});

			generate.data.shared.worth.element.build($element, value.worth);
			generate.counter.radio++;

			return $element 
		},
		getter: function($element, _action) {
			$element.change(function(event) {
				var value = $element.find(":checked").val();
				_action(value);
			});
		},

		fill: function($element, checked) {
			$element.find("input").each(function(index, el) {
				var value = $(this).val();

				if(value === checked) {
					$(this).prop('checked', true);	
				}
			});
		},

		value_sample: {
			values: ["Вариант 1", "Вариант 2", "Вариант 3"]
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__radio/exports.html" %}',
		parse: function() {
			var result = generate.data.shared.options.edit.parse("radio");

			result.worth = generate.data.shared.worth.edit.parse();
			if(result.answer) {
				result.answer = result.answer[0]
			}
			return result
		},
		middleware: function() {
			generate.data.shared.options.edit.middleware("radio");
			generate.data.shared.worth.edit.middleware();
		},
		fill: function(value) {
			generate.data.shared.options.edit.fill(value);
			generate.data.shared.worth.edit.fill(value.worth);
		}
	}
}

generate.data["answer--text"] = {
	element: {
		type: 'answer',
		
		parse: function($original) {
			return {
				label: $original.find('label').html(),
				answer: $original.attr('answer'),
				class: "answer--text",
				type: "answer",
				worth: generate.data.shared.worth.element.parse($original)
			}
		},

		build: function(value) {
			$element = $(generate.build.template.answer('answer--text'));
			$element.html('{% include "Elements/Inputs/text/exports.html" %}');
			$element.find('label').text(value.label);

			generate.data.shared.worth.element.build($element, value.worth);

			return $element;
		},

		fill: function($element, answer) {
			// console.log(answer);
			$element.find('input').val(answer);
			$element.find('label').addClass('m--top');
		},

		getter: function($element, _action) {
			var timer;
			var typing_interval = 1000;

			$element.on('change', function() {
				var value = $element.find('.__value').val();
				clearTimeout(timer); 
				_action(value);
			});
			
			$element.keydown(function(event) {
				$element.keydown(function() {
					clearTimeout(timer); 
					timer = setTimeout(function() {
						var value = $element.find('.__value').val();
						_action(value);
					}, typing_interval);
				});
			});
		},
		value_sample: {
			label: "Текстовый ответ"
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__text/exports.html" %}',
		parse: function() {
			var label = $('#new_element_label').val()
			var answer = $('#new_element_answer').val()

			return {
				label: label,
				answer: answer,
				worth: generate.data.shared.worth.edit.parse()
			}
		},
		middleware: function() {
			generate.data.shared.worth.edit.middleware();
		},
		fill: function(value) {
			$('#new_element_answer').val(value.answer).focus();			
			$('#new_element_label').val(value.label).focus();
			generate.data.shared.worth.edit.fill(value.worth);
		}
	}
}

generate.data["answer--textarea"]= {
	element: {
		type: "answer",
		parse: function($original) {

			return {
				label: $original.find('label').html(),
				class: "answer--textarea",
				type: "answer",
				worth: generate.data.shared.worth.element.parse($original)
			}
		},
		build: function(value) {
			$element = $(generate.build.template.answer("answer--textarea"))
			$element.html('{% include "Elements/Inputs/text/textarea/exports.html" %}')
			$element.find("label").text(value.label)

			generate.data.shared.worth.element.build($element, value.worth);

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

		fill: function($element, answer) {
			// console.log(answer);
			$element.find('input').val(answer);
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

generate.data["question--empty"] = {
	element: {
		type: "question",
		nopull: true,
		parse: function($original) {
			return {
				text: "Добавьте сюда вопрос",
				class: "question--empty",
				type: "question"
			}
		},
		build: function(value) {
			return $("<div class='m--empty question--empty'>Добавьте сюда вопрос</div>");
		},
		value_sample: {
			text: "Добавьте сюда вопрос"
		}
	},
	edit: {}
}

generate.data["question--file"] = {
	element: {
		type: "question",
		parse: function($original) {
			return {
				url: $original.find("a.m--card").attr("d-href"),
				class: "question--file",
				id: $original.find("a.m--card").attr("id"),
				size: $original.find(".__size").text(),
				name: $original.find(".__name").text(),
				type: "question"
			}
		},
		build: function(value) {
			var file_template = $('{% include "Elements/card/file/exports.html" %}');

			//turning link off
			if(typeof editor !== "undefined") {
				file_template.removeAttr('href');
				file_template.removeAttr('download');
				file_template.find(".card").removeAttr('tip');
				//d-disabled
				file_template.attr("d-href", value.url);
			} else {
				file_template.attr("href", value.url);
			}
			
		
			file_template.find(".__name").text(value.name);
			
			file_template.find(".__size").text(value.size);
			file_template.attr("id", value.id);
			

			return $(generate.build.template.question("question--file"))
				.append(file_template);
		},
		value_sample: {
			name: "Файл для скачивания",
			size: "3.21МБ",
			id: undefined,
			url: "http://science-all.com/images/wallpapers/hipster-wallpaper/hipster-wallpaper-21.jpg"
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__question/__file/exports.html" %}',
		parse: function() {
			var original_id = $("#new_file").attr("original-id");
			var url, name, size, id;
			if(generate.data.shared.file_changed) {
				id = generate.data.shared.assets.last_id;
			} else {
				if(generate.data.shared.assets[original_id]) {
					id = original_id;
				} else {
					var sample =  generate.data["question--file"]
						.element.value_sample;
					return sample;
				}
			}

			name = $("#new_file_name").val();
			if(url = generate.data.shared.assets[id].urls) {
				url = generate.data.shared.assets[id].urls[0]
				size = Math.floor(generate.data.shared.assets[id]
					.files[0].size/1024/1024*100)/100 + "MB";

				// console.log(name);
				return {
					url: url,
					name: name,
					size: size,
					id: id
				}
			} else {
				var sample =  generate.data["question--file"]
						.element.value_sample;
					return sample;
			}
		},
		fill: function(value) {
			// console.log(value);
			if((! value.url) && generate.data.shared.assets[value.id]) {
				value.url = generate.data.shared.assets[value.id].name;
			}
			var full_link = value.url;
			var file_link = full_link.split("/")[full_link.split("/").length-1];

			$("#new_file_name").val(value.name).focus();
			$("#new_file").parent().find(".__text").text(file_link);
			$("#new_file").attr("original-id", value.id);
		},
		middleware: function() {
			generate.data.shared.catch_asset_file()
		}
	}
}

generate.data["question--image"] = {
	element: {
		type: "question",
		parse: function($original) {
			return {
				url: $original.find("img").attr("src"),
				class: "question--image",
				type: "question"
			}
		},
		build: function(value) {
			return $(generate.build.template.question("question--image")).append("<img src="
				+value.url+">")
		},
		value_sample: {
			url: "/media/samples/image.jpg"
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__question/__image/exports.html" %}',
		parse: function() {

			var url;
			// console.log($("#new_element_file").val());

			if($("#new_element_file").val() != "") {
				url = generate.data.shared.assets[
					generate.data.shared.assets.last_id
				].urls[0];
			} else {
				url = $("#new_element_url").val();
			}

			return {
				url: url 
			}
		},
		fill: function(value) {
			$("#new_element_url").val(value.url).focus()
		},
		middleware: function() {
			generate.data.shared.catch_asset_file()
		}
	}
}

generate.data["question--text"] = {
	element: {
		type: "question",
		parse: function($original) {
			var html = $original.children('.__text-content').html();
			return {
				text: html,
				class: "question--text",
				type: "question"
			}
		},
		build: function(value) {
			var $question = $(generate.build.template.question("question--text"))
			var $content = $("<div class='__text-content'></div>");
			$content.html(value.text);
			return $question.html($content);
		},
		value_sample: {
			text: "Текстовый вопрос"
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__question/__text/exports.html" %}',
		parse: function() {			
			return {
				text: $("#new_element_text").html()
			}
		},
		fill: function(value) {
			$("#new_element_text").html(value.text).focus();
		}
	}
}

generate.data.shared.worth = {
  element: {
    parse: function($original) {
      return $original.attr('worth') || "1";
    },
    build: function($new_element, value) {
      $new_element.attr('worth',  value);
    }
  },
  edit: {
    parse: function() {
      var worth = parseInt($('#max_mark').val());
      if( ! worth > 0) {
        worth = 1;
      }
      
      return worth;
    },
    middleware: function() {
        setTimeout(function() {
         if($('#max_mark').val() === '') {
            $('#max_mark').val(1);
          }
        }, 100);
      $('#max_mark').parent().find('label').addClass('m--top');
    },
    fill: function(value) {
      $('#max_mark').val(value).focus();
    }
  }
}

generate.data.shared.assets = {}
generate.data.shared.file_changed=false;

generate.data.shared.assets.last_id = 0
generate.data.shared.assets.get_id = function() {
	generate.data.shared.assets.last_id++;
	return generate.data.shared.assets.last_id;
}

generate.data.shared.catch_asset_file = function() {
	generate.data.shared.file_changed = false;
	$file_input = pull_put.ui.$.find(".input.m--file");

	new_id = generate.data.shared.assets.get_id();

	generate.data.shared.assets[new_id] = file_catcher.add($file_input);

	$file_input.change(function(event) {
		generate.data.shared.file_changed = true;
	});
}

generate.data.shared.options = {
	element: {
		parse: function($original, type) {
			var $items = $original.find(".m--" + type);
			var values = [];
			$items.each(function(index, el) {
				values.push($(this).children("label").text());
			});

			// getting answer
			if ($original.attr('answer')) {
				answer = $original.attr('answer').split(", ");
			} else {
				answer = [];
			}

			if(type === "radio" && answer) {
					answer = answer[0];
				}

			return {
				values: values,
				answer: answer,
				class: "answer--" + type,
				type: "answer"
			}
		}
	},
	edit: {
		parse : function(type) {

			var $items = $(".options-edit").find(".m--"+type);
			var answer = [];
			var values = [];

			$items.each(function(index, el) {
				var label = $(this).siblings().find(".__value").val();

				values.push(label);
				
				if($(this).find("input").is(":checked")) {
					answer.push(label);
				}
			});

			return {
				values: values,
				answer: answer
			}
		},
		middleware: function(type) {
			var middleware_text = {
				radio : '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__radio/__item/exports.html" %}',
				checkbox : '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__checkbox/__item/exports.html" %}'
			}
			var empty_item = middleware_text[type];

			generate.data.shared.add_item = function() {
				var $new_item = $(empty_item);
				
				$(".options-edit .__items").append($new_item);
				button_delete.add($new_item);
			}

			$(".options-edit .__add").click(function(event) {
				generate.data.shared.add_item();
			});
		},
		fill: function(value) {
			value.values.forEach(function(label) {
				generate.data.shared.add_item();
				$(".options-edit .__items").children().last()
					.find(".__value").val(label);

				
				var checker = function() {return false};

				if(typeof value.answer === "string") {
					checker = function(answer, item) {
						return item === answer;
					}
				} else if(typeof value.answer === "object") {
					checker = function(answer, item) {
						return (answer.indexOf(item) > -1);
					}
				}

				if( checker(value.answer, label) ) {
					// console.log("ok")
					$(".options-edit .__items").find("label input")
						.last().prop("checked", true);
				}
			});
		}
	}
}
