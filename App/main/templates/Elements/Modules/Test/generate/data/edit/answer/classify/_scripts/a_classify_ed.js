generate.register.edit('answer', 'classify', {
  random_possible: true,
  split_score_possible: true,

  create_item: function(item_text) {
    var $new_item = $(loads.get('Elements/Modules/Test/generate/' +
                                'data/elements/answer/classify/__item/'));

    $new_item.append(render.inputs.text("Текст элемента", '', item_text));
    button_delete.add($new_item);

    return $new_item;
  },

  create_class: function(title, items, special_class) {
    var self = this;
    var $new_class = $(loads.get('Elements/Modules/Test/generate/' +
                                 'data/elements/answer/classify/'));
    var $items = $new_class.find('.__items');
    var $add_btn = $('<button class="m--ghost m--icon"></button>');

    if(items.length > 0) {
      items.forEach(function(item_text) {
        $items.append(self.create_item(item_text));
      });
    }

    $new_class.find('.__title').text(title).attr('contenteditable', 'true');
    $new_class.addClass(special_class);

    button_delete.add($new_class);
    $add_btn.append(loads['Elements/Icons/add.svg']);
    $add_btn.click(function() {
      $add_btn.before(self.create_item(''));
    });
    $new_class.find('.__items').append($add_btn);

    return $new_class;
  },

  builder: function(value) {
    var self = this;
    var items_copy = value.items ? value.items.slice() : [];

    var $new_element = self.make_template(value);
    var $add_btn = $('<button class="m--ghost m--icon"></button>');

    if(value.classes) {
      value.classes.forEach(function(class_name) {
        var class_items = [];

        if(value.answer[class_name]) {
          value.answer[class_name].forEach(function(item) {
            items_copy.remove(item);
            class_items.push(item);
          });
        }

        $new_element.append(self.create_class(class_name, class_items));
      });
    }

    if(items_copy.length > 0) {
      $new_element.append(self.create_class('', items_copy, 'm--unordered'));
    }

    $add_btn.append(loads['Elements/Icons/add.svg']);
    $add_btn.click(function() {
      $add_btn.before(self.create_class('', []));
    });
    $new_element.append($add_btn);

    return $new_element;
  },

  parser: function($edit) {
    var items = [],
        classes = [],
        answer = {};
    var empty  = 1;
    $edit.children('.__class').each(function() {
      var title = $(this).children('h3').text();
      if(title === '') {
        title = 'Тип ' + empty;
        empty++;
      }

      answer[title] = [];
      classes.push(title);

      //loop over items
      $(this).find('input').each(function() {
        if(this.value) {
          answer[title].push(this.value);
          items.push(this.value);
        }
      });
    });

    return {
      items: items,
      classes: classes,
      answer: answer
    }
  }
});
