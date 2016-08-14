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
      // console.log(value);

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
      if(typeof answer !== 'object'){
        answer = JSON.parse(answer)
      }
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
