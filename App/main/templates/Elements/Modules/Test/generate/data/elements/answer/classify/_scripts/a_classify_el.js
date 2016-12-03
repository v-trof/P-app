generate.register.element('answer', 'classify', {
  show_in_items: true,

  create_item: function(item_text, indicator_index) {
    var $new_item = $(loads.get('Elements/Modules/Test/generate/' +
                                'data/elements/answer/classify/__item/'));
    $new_item.text(item_text);

    //binding pull_put
    pull_put.puller.add(
      $new_item, //element
      [], //actions
      undefined, //additional
      function() {
        indicator.show(indicator_index);
      },
      false,
      true
    );

    return $new_item;
  },

  check: function($element) {
    $element.find('.__items').each(function() {
      if($(this).children('.__item').length === 0) {
        if($(this).children('.m--classify-empty').length === 0) {
          $(this).append('<div class="m--classify-empty">Пусто</div>');
        }
      } else {
        $(this).children('.m--classify-empty').remove();
      }
    });
  },

  create_class: function(title, items, special_class, indicator_index) {
    var self = this;
    var $new_class = $(loads.get('Elements/Modules/Test/generate/' +
                                 'data/elements/answer/classify/'));

    var $items = $new_class.find('.__items');
    if(items.length === 0) {
      $items.append('<div class="m--classify-empty">Пусто</div>');
    } else {
      items.forEach(function(item_text) {
        $items.append(self.create_item(item_text, indicator_index));
      });
    }

    //binding pull_put
    pull_put.put_zone.add($(this), function(event, $this, $pulled) {
      if($pulled.hasClass('classy_item_'+indicator_index)) {
        $this.find('.__items').append($pulled);
        pull_put.reset();
        indicator.hide(indicator_index);
        self.check($new_class.parent());
      }
    });

    indicator.add($new_class.find('.__items'), 'add', indicator_index);

    $new_class.find('.__title').text(title);
    $new_class.addClass(special_class);

    return $new_class;
  },

  builder: function(value) {
    var self = this;
    var indicator_index = generate.counter.classify++;

    var items_copy = value.items.slice();

    var $new_element = self.make_template(value);

    value.classes.forEach(function(class_name) {
      var class_items = [];

      if(value.answer[class_name]) {
        value.answer[class_name].forEach(function(item) {
          items_copy.remove(item);
          class_items.push(item);
        });
      }

      $new_element.append(self.create_class(class_name, class_items, '',
                                            indicator_index));
    });

    if(items_copy.length > 0) {
      $new_element.append(self.create_class('', items_copy, 'm--unordered',
                                            indicator_index));
    }

    return $new_element;
  },

  sample: {
    value: {
      classes:  ["Глаголы", "Существительные"],
      items: ["Дом", "Стол", "Бук"],
      answer: {}
    }
  }
});
